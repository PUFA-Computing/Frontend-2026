import apiClient from "./apiClient";
import Event from "../../models/event";
import { API_EVENT } from "@/config/config";
import FormData from "form-data";
import { cacheManager, CACHE_TTL } from "@/lib/cacheManager";

/**
 * Fetches a list of events from the specified API endpoint.
 *
 * @returns {Promise<Event[]>} A promise that resolves to an array of Event objects.
 * @throws {Error} If an error occurs during the API request.
 */
export const fetchEvents = async (): Promise<Event[]> => {
    const cacheKey = 'events:all';

    // Try to get from cache first
    const cached = cacheManager.get<Event[]>(cacheKey);
    if (cached) {
        console.log('[Events] Returning cached events');
        return cached;
    }

    try {
        // Make a GET request to the API endpoint
        const response = await apiClient.get(API_EVENT);

        // Extract event data from the response with proper validation
        const eventData = response.data?.data || [];

        // Validate and process each event
        const processedEvents = eventData.map((event: Event) => {
            try {
                return {
                    ...event,
                    start_date: new Date(event.start_date || Date.now()),
                    end_date: new Date(event.end_date || Date.now()),
                    created_at: new Date(event.created_at || Date.now()),
                    updated_at: new Date(event.updated_at || Date.now())
                };
            } catch (parseError) {
                console.error("Error parsing event dates", parseError, event);
                // Return event with fallback dates if parsing fails
                return {
                    ...event,
                    start_date: new Date(),
                    end_date: new Date(),
                    created_at: new Date(),
                    updated_at: new Date()
                };
            }
        });

        // Cache the processed events
        cacheManager.set(cacheKey, processedEvents, CACHE_TTL.EVENTS);

        // Return the array of processed Event objects
        return processedEvents as Event[];
    } catch (error) {
        // Log an error message but return empty array instead of throwing
        console.error("Error fetching events", error);
        // Return empty array to prevent page from crashing
        return [];
    }
};

/**
 * Fetches a single event by its slug from the specified API endpoint.
 *
 * @returns {Promise<Event>} A promise that resolves to the Event object with the specified ID.
 * @throws {Error} If an error occurs during the API request.
 * @param eventSlug
 */
export const fetchEventBySlug = async (eventSlug: string): Promise<Event> => {
    const cacheKey = `events:slug:${eventSlug}`;

    // Try to get from cache first
    const cached = cacheManager.get<Event>(cacheKey);
    if (cached) {
        console.log(`[Events] Returning cached event: ${eventSlug}`);
        return cached;
    }

    try {
        // Make a GET request to the API endpoint
        const response = await apiClient.get(`${API_EVENT}/${eventSlug}`);

        // Extract the event data from the response
        const eventData = response.data?.data;
        eventData.start_date = new Date(eventData.start_date);
        eventData.end_date = new Date(eventData.end_date);
        eventData.created_at = new Date(eventData.created_at);
        eventData.updated_at = new Date(eventData.updated_at);

        // Cache the event data
        cacheManager.set(cacheKey, eventData, CACHE_TTL.EVENTS);

        // Return the Event object
        return eventData as Event;
    } catch (error) {
        // Log an error message and rethrow the error
        console.error(`Error fetching event with slug ${eventSlug}`, error);
        throw error;
    }
};

interface EventCreation {
    title: string;
    start_date: string;
    end_date: string;
    organization_id: number;
    description: string;
    max_registration: number;
}

/**
 * Creates a new event using the specified data and sends it to the API endpoint.
 *
 * @param {Event} eventData The data for the new event.
 * @param file The image file for the event.
 * @param accessToken The access token for the user.
 * @returns {Promise<Event>} A promise that resolves to the newly created Event object.
 * @throws {Error} If an error occurs during the API request.
 */
export const createEvent = async (
    eventData: EventCreation,
    file: File,
    accessToken: string
): Promise<Event> => {
    try {
        const formData = new FormData();

        formData.append("file", file, file.name);

        // Format dates as RFC3339 format which Go expects
        const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            return date.toISOString(); // Returns full ISO string with time and timezone
        };

        const formattedEventData = {
            ...eventData,
            start_date: formatDate(eventData.start_date),
            end_date: formatDate(eventData.end_date),
        };

        console.log('Formatted event data being sent to API:', formattedEventData);

        // Convert eventData to JSON string and append it with content type application/json.
        formData.append("data", JSON.stringify(formattedEventData));

        // Make a POST request to the API endpoint.
        const response = await apiClient.post(`${API_EVENT}/create`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data",
            },
        });

        // Extract the newly created event data from the response.
        const newEventData = response.data?.data;

        // Invalidate events cache since we created a new event
        cacheManager.invalidate('events:*');

        // Return the newly created Event object.
        return newEventData as Event;
    } catch (error) {
        // Log an error message and rethrow the error.
        console.error("Error creating event", error);
        throw error;
    }
};

/**
 * Updates an existing event with the specified ID using the provided data.
 *
 * @param {string} eventId The ID of the event to update.
 * @param {Event} eventData The updated data for the event.
 * @param file The image file for the event (optional).
 * @param accessToken The access token for the user.
 * @returns {Promise<Event>} A promise that resolves to the updated Event object.
 * @throws {Error} If an error occurs during the API request.
 */
export const updateEvent = async (
    eventId: string,
    eventData: EventCreation,
    file: File | null,
    accessToken: string
): Promise<Event> => {
    try {
        console.log('updateEvent called with:', { eventId, eventData, hasFile: !!file });

        const formData = new FormData();

        // Format dates properly
        const formattedEventData = {
            ...eventData,
            start_date: new Date(eventData.start_date).toISOString(),
            end_date: new Date(eventData.end_date).toISOString(),
        };

        // Convert eventData to JSON string and append it with content type application/json
        formData.append("data", JSON.stringify(formattedEventData));

        // Only append file if it exists
        if (file) {
            formData.append("file", file, file.name);
            console.log('File appended to form data:', file.name);
        } else {
            console.log('No file provided for update');
            // Add a dummy empty file to satisfy the multipart requirement
            // This is a workaround for backends that expect a file field even if empty
            const emptyBlob = new Blob([""], { type: "text/plain" });
            formData.append("file", emptyBlob, "empty.txt");
        }

        // The backend expects a PATCH request to /:eventID/edit
        console.log('Making PATCH request to:', `${API_EVENT}/${eventId}/edit`);

        // Make a PATCH request to the API endpoint
        const response = await apiClient.patch(
            `${API_EVENT}/${eventId}/edit`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        console.log('Update response:', response.data);

        // Extract the updated event data from the response
        const updatedEventData = response.data?.data;

        // Invalidate events cache since we updated an event
        cacheManager.invalidate('events:*');

        // Return the updated Event object
        return updatedEventData as Event;
    } catch (error: any) {
        // Log an error message with detailed information
        console.error(`Error updating event with ID ${eventId}:`, error);
        console.error('Response data:', error.response?.data);
        console.error('Status:', error.response?.status);
        throw error;
    }
};

/**
 * Deletes an existing event with the specified ID from the API endpoint.
 *
 * @param {number} eventId The ID of the event to delete.
 * @param accessToken The access token for the user.
 * @returns {Promise<void>} A promise that resolves when the event has been deleted.
 * @throws {Error} If an error occurs during the API request.
 */
export const deleteEvent = async (
    eventId: number,
    accessToken: string
): Promise<void> => {
    try {
        // Make a DELETE request to the API endpoint.
        await apiClient.delete(`${API_EVENT}/${eventId}/delete`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Invalidate events cache since we deleted an event
        cacheManager.invalidate('events:*');
    } catch (error) {
        // Log an error message and rethrow the error.
        console.error(`Error deleting event with ID ${eventId}`, error);
        throw error;
    }
};

// Get All users registered for an event
export const fetchUsersRegistered = async (
    eventId: number,
    accessToken: string
) => {
    try {
        // Make a GET request to the API endpoint
        const response = await apiClient.get(
            `${API_EVENT}/${eventId}/registered-users`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Extract the event data from the response
        return response.data?.data;
    } catch (error) {
        // Log an error message and rethrow the error
        console.error(
            `Error fetching users registered for event with ID ${eventId}`,
            error
        );
        throw error;
    }
};

export const totalRegisteredUsers = async (eventId: number) => {
    try {
        // Make a GET request to the API endpoint
        const response = await apiClient.get(
            `${API_EVENT}/${eventId}/total-participant`
        );

        // Extract the event data from the response
        return response.data?.data; // This should be a number based on the provided API response example
    } catch (error) {
        // Log an error message and rethrow the error
        console.error(
            `Error fetching total registered users for event with ID ${eventId}`,
            error
        );
        throw error;
    }
};