"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import {
    deleteEvent,
    fetchEventBySlug,
    updateEvent,
    createEvent,
} from "@/services/api/event";
import Event from "@/models/event";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import Seperator from "@/components/Seperator";
import Image from "next/image";
import ListUserRegistered from "./ListUserRegistered";
import { CircularProgress } from "@/components/ui/CircularProgress";
import Select from "react-select";
import { Spinner } from "@nextui-org/spinner";
import { EventCreation } from "@/app/(admin)/admin/events/create/_components/CreateEvent";
import Picker from "react-datepicker";

const tabs = [
    { name: "Event Details", key: "eventDetails" },
    { name: "List User Registered", key: "listUserRegistered" },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function EventDetails() {
    const pathname = usePathname();
    const router = useRouter();
    // get the slug from the pathname
    const slug = pathname.split("/").pop();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const session = useSession();
    const [newPoster, setNewPoster] = useState<File | null>(null);
    const [activeTab, setActiveTab] = useState<string>(tabs[0].key);
    const [max_registration, setMaxRegistration] = useState<number>(0);
    const [formData, setFormData] = useState<EventCreation>({
        title: "",
        start_date: "",
        end_date: "",
        organization_id: 0,
        description: "",
        max_registration: 0,
    });

    // Props for the organization select component
    const organizationOptions = [
        { value: 1, label: "PUFA Computing" },
        { value: 2, label: "PUMA IT" },
        { value: 3, label: "PUMA IS" },
    ];

    useEffect(() => {
        if (slug) {
            setLoading(true);
            const getEvent = async () => {
                try {
                    const fetchedEvent = await fetchEventBySlug(slug as string);
                    setEvent(fetchedEvent);
                } catch (error) {
                    console.error("Error fetching event data:", error);
                } finally {
                    setLoading(false);
                }
            };
            getEvent().then((r) => r);
        }
    }, [slug]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (event) {
            // Special handling for date fields to ensure proper date format
            if (name === 'start_date' || name === 'end_date') {
                // Create a date object with the value from the date input
                // and preserve the time portion from the original date
                const originalDate = new Date(name === 'start_date' ? event.start_date : event.end_date);
                const [year, month, day] = value.split('-').map(Number);
                
                // Create a new date with the selected date but keep original time
                const newDate = new Date(originalDate);
                newDate.setFullYear(year);
                newDate.setMonth(month - 1); // Month is 0-indexed in JavaScript
                newDate.setDate(day);
                
                setEvent((prevEvent) =>
                    prevEvent ? { ...prevEvent, [name]: newDate } : null
                );
            } else {
                // For non-date fields, update normally
                setEvent((prevEvent) =>
                    prevEvent ? { ...prevEvent, [name]: value } : null
                );
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log('New poster file selected:', file.name, file.size, 'bytes');
            setNewPoster(file);
        }
    };

    const handleSelectChange = (selectedOption: any) => {
        setEvent((prevEvent) =>
            prevEvent
                ? { ...prevEvent, organization_id: selectedOption.value }
                : null
        );
    };

    const handleDelete = async () => {
        if (!session.data) {
            return null;
        }
        if (event) {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "Do you really want to delete this event? This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel",
            });

            if (result.isConfirmed) {
                try {
                    setSaving(true);
                    await deleteEvent(event.id, session.data.user.access_token);
                    await Swal.fire({
                        icon: "success",
                        title: "Event Deleted",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    router.push("/admin/events");
                } catch (error) {
                    console.error("Error deleting event:", error);
                    await Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Error deleting event",
                    });
                } finally {
                    setSaving(false);
                }
            }
        }
    };

    const handleSave = async () => {
        if (!event) return;

        setSaving(true);

        try {
            // Validate required fields
            if (!event.title || !event.start_date || !event.end_date) {
                throw new Error("Please fill in all required fields");
            }

            // Ensure dates are properly formatted with time component
            // The backend expects dates in full ISO format with time and timezone
            const formatDateWithTime = (date: Date | string) => {
                const dateObj = new Date(date);
                // Ensure the date is valid before formatting
                if (isNaN(dateObj.getTime())) {
                    console.error('Invalid date:', date);
                    // Return current date as fallback
                    return new Date().toISOString();
                }
                return dateObj.toISOString();
            };

            // Log the dates for debugging
            console.log('Original start_date:', event.start_date);
            console.log('Original end_date:', event.end_date);
            console.log('Formatted start_date:', formatDateWithTime(event.start_date));
            console.log('Formatted end_date:', formatDateWithTime(event.end_date));

            const eventData = {
                title: event.title,
                start_date: formatDateWithTime(event.start_date),
                end_date: formatDateWithTime(event.end_date),
                organization_id: event.organization_id,
                description: event.description,
                max_registration: event.max_registration,
            };

            console.log('Updating event with data:', eventData);
            
            // Create a FormData object for the request
            const formData = new FormData();
            formData.append('data', JSON.stringify(eventData));
            
            // Handle file upload
            if (newPoster) {
                console.log('Adding new poster file:', newPoster.name, newPoster.size, 'bytes', newPoster.type);
                // Explicitly set the file name and content type
                formData.append('file', newPoster, newPoster.name);
            } else {
                console.log('No new poster file');
                // Add a dummy empty file to satisfy multipart requirement
                // Make sure this matches what the backend expects for empty files
                const emptyBlob = new Blob([""], { type: "text/plain" });
                formData.append("file", emptyBlob, "empty.txt");
            }
            
            // Use direct fetch API for more control
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/event/${event.id}/edit`;
            console.log('Making direct PATCH request to:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${session.data?.user.access_token || ''}`,
                    // Don't set Content-Type for multipart/form-data
                },
                body: formData
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response error:', response.status, errorText);
                throw new Error(`Server returned ${response.status}: ${errorText}`);
            }
            
            const result = await response.json();
            console.log('Update result:', result);
            
            // Force refresh the image by reloading the event data
            if (slug) {
                try {
                    // Add a cache-busting parameter to force reload
                    const timestamp = new Date().getTime();
                    const updatedEvent = await fetchEventBySlug(slug as string);
                    
                    // Update the event with the new data including the new image URL
                    if (updatedEvent && updatedEvent.thumbnail) {
                        // Add a timestamp to the thumbnail URL to prevent caching
                        const cacheBustedUrl = updatedEvent.thumbnail.includes('?') 
                            ? `${updatedEvent.thumbnail}&t=${timestamp}` 
                            : `${updatedEvent.thumbnail}?t=${timestamp}`;
                            
                        setEvent({
                            ...updatedEvent,
                            thumbnail: cacheBustedUrl
                        });
                        
                        console.log('Event refreshed with new thumbnail:', cacheBustedUrl);
                    } else {
                        setEvent(updatedEvent);
                    }
                } catch (refreshError) {
                    console.error('Error refreshing event data:', refreshError);
                }
            }
            
            await Swal.fire({
                icon: "success",
                title: "Event Updated",
                text: "Changes saved successfully!",
                showConfirmButton: true,
                timer: 2000,
            });
            
            // Redirect after a short delay to allow the user to see the success message
            setTimeout(() => {
                router.push("/admin/events");
            }, 2000);
            
        } catch (error) {
            console.error("Error updating event:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error updating event. Please check console for details.",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (!event) {
        return <CircularProgress />;
    }

    const selectedOrganization = organizationOptions.find(
        (option) => option.value === event.organization_id
    );

    return (
        <div className="space-y-6">
            <div className="px-4 sm:px-4">
                <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">
                        Select a tab
                    </label>
                    <select
                        id="tabs"
                        name="tabs"
                        className="block w-full rounded-lg border-gray-300 bg-white/80 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                    >
                        {tabs.map((tab) => (
                            <option key={tab.key} value={tab.key}>
                                {tab.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="hidden sm:block">
                    <nav
                        className="isolate flex overflow-hidden rounded-xl shadow-sm bg-white/90 backdrop-blur-sm border border-gray-100"
                        aria-label="Tabs"
                    >
                        {tabs.map((tab, tabIdx) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={classNames(
                                    tab.key === activeTab
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50",
                                    tabIdx === 0 ? "rounded-l-xl" : "",
                                    tabIdx === tabs.length - 1
                                        ? "rounded-r-xl"
                                        : "",
                                    "group relative min-w-0 flex-1 overflow-hidden px-6 py-4 text-center text-sm font-medium transition-all duration-200 focus:z-10"
                                )}
                                aria-current={
                                    tab.key === activeTab ? "page" : undefined
                                }
                            >
                                <span>{tab.name}</span>
                                <span
                                    aria-hidden="true"
                                    className={classNames(
                                        tab.key === activeTab
                                            ? "bg-blue-500"
                                            : "bg-transparent",
                                        "absolute inset-x-0 bottom-0 h-0.5"
                                    )}
                                />
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {activeTab === "eventDetails" && (
                <div>
                    {/*Warning alert this update events on maintenance*/}
                    <div
                        className="mx-4 mb-6 rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-4 px-5 py-4 text-yellow-700 shadow-sm"
                        role="alert"
                    >
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-yellow-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                            <div>
                                <p className="font-semibold text-base">Warning</p>
                                <p className="text-sm mt-0.5">
                                    This page is currently under maintenance. Please be
                                    patient for the updates.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/*Button Delete Event*/}
                    <div className="flex justify-end px-4 mb-4">
                        <Button
                            onClick={handleDelete}
                            className="border border-red-500 bg-red-500 px-6 py-2 text-white hover:bg-white hover:text-red-500 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Delete Event
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2">
                        <div>
                            <div className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 flex items-center justify-between">
                                    <p className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                                        </svg>
                                        Event Details
                                    </p>
                                </div>
                                <Seperator className="border-gray-100" />
                                <div className="space-y-6 px-6 py-6">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <label htmlFor="title" className="text-sm font-medium text-gray-700">Event Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                id="title"
                                                className="border-gray-300 bg-white/80 focus:border-blue-500 focus:ring-blue-500 block h-10 w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-all duration-200"
                                                placeholder="Enter event title"
                                                value={event.title}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor="slug" className="text-sm font-medium text-gray-700">Event Slug</label>
                                            <input
                                                name="Slug"
                                                id="slug"
                                                type="text"
                                                value={event.slug}
                                                placeholder={event.slug}
                                                onChange={handleInputChange}
                                                disabled
                                                className="border-gray-200 bg-gray-50 text-gray-500 block h-10 w-full rounded-lg border px-3 py-2 text-sm shadow-sm disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                                            <input
                                                type="text"
                                                name="description"
                                                id="description"
                                                className="border-gray-300 bg-white/80 focus:border-blue-500 focus:ring-blue-500 block h-10 w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-all duration-200"
                                                placeholder="Enter event description"
                                                value={event.description}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor="organization" className="text-sm font-medium text-gray-700">Organization</label>
                                            <Select
                                                id="organization"
                                                name="organization"
                                                value={selectedOrganization}
                                                onChange={handleSelectChange}
                                                options={organizationOptions}
                                                className="block w-full rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 border-gray-300"
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderRadius: '0.5rem',
                                                        height: '40px',
                                                        minHeight: '40px',
                                                        borderColor: '#D1D5DB',
                                                    }),
                                                    option: (baseStyles, state) => ({
                                                        ...baseStyles,
                                                        backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EFF6FF' : 'white',
                                                        color: state.isSelected ? 'white' : '#374151',
                                                    }),
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="start_date" className="text-sm font-medium text-gray-700">Start Date</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5" />
                                                </svg>
                                            </div>
                                            <input
                                                type="date"
                                                name="start_date"
                                                id="start_date"
                                                className="border-gray-300 bg-white/80 focus:border-blue-500 focus:ring-blue-500 block h-10 w-full rounded-lg border pl-10 pr-3 py-2 text-sm shadow-sm transition-all duration-200"
                                                placeholder="Start Date"
                                                value={
                                                    new Date(event.start_date)
                                                        .toISOString()
                                                        .split("T")[0]
                                                }
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value) {
                                                        // Create a new date with the selected date but keep time at noon
                                                        const [year, month, day] = value.split('-').map(Number);
                                                        const newDate = new Date(year, month - 1, day, 12, 0, 0);
                                                        setEvent(prev => prev ? {...prev, start_date: newDate} : null);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="end_date" className="text-sm font-medium text-gray-700">End Date</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5" />
                                                </svg>
                                            </div>
                                            <input
                                                type="date"
                                                name="end_date"
                                                id="end_date"
                                                className="border-gray-300 bg-white/80 focus:border-blue-500 focus:ring-blue-500 block h-10 w-full rounded-lg border pl-10 pr-3 py-2 text-sm shadow-sm transition-all duration-200"
                                                placeholder="End Date"
                                                value={
                                                    new Date(event.end_date)
                                                        .toISOString()
                                                        .split("T")[0]
                                                }
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value) {
                                                        // Create a new date with the selected date but keep time at noon
                                                        const [year, month, day] = value.split('-').map(Number);
                                                        const newDate = new Date(year, month - 1, day, 12, 0, 0);
                                                        setEvent(prev => prev ? {...prev, end_date: newDate} : null);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="max_registration" className="text-sm font-medium text-gray-700">Maximum Registration</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="number"
                                                name="max_registration"
                                                id="max_registration"
                                                className="border-gray-300 bg-white/80 focus:border-blue-500 focus:ring-blue-500 block h-10 w-full rounded-lg border pl-10 pr-3 py-2 text-sm shadow-sm transition-all duration-200"
                                                placeholder="Enter maximum participants"
                                                value={event.max_registration}
                                                onChange={handleInputChange}
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div
                                className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden"
                                style={{ height: "fit-content" }}
                            >
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 flex items-center justify-between">
                                    <p className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                        Event Poster
                                    </p>
                                </div>
                                <Seperator className="border-gray-100" />
                                <div className="p-6">
                                    <div className="mb-6">
                                        <div className="flex justify-center">
                                            <div className="relative group rounded-xl overflow-hidden shadow-md border border-gray-200 bg-gray-50">
                                                <Image
                                                    src={
                                                        event.thumbnail 
                                                        ? `${event.thumbnail}?t=${new Date().getTime()}` 
                                                        : "https://sg.pufacomputing.live/Assets/male.jpeg"
                                                    }
                                                    alt={`${event.title} Poster`}
                                                    className="h-72 w-56 object-cover transition-all duration-300 group-hover:scale-105"
                                                    width={480}
                                                    height={240}
                                                    unoptimized={true} // Disable Next.js image optimization to prevent caching
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                                    <p className="text-white text-sm font-medium">{event.title}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-gray-700">
                                        <label
                                            htmlFor="dropzone-file"
                                            className="mx-auto flex w-full cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 hover:bg-gray-50 hover:border-blue-400 transition-all duration-200"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="h-8 w-8 text-blue-500 mb-2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                                                    />
                                                </svg>

                                                <h2 className="text-sm font-medium text-gray-700">
                                                    Upload New Poster
                                                </h2>

                                                <p className="mt-1 text-xs text-gray-500 text-center">
                                                    SVG, PNG, or JPG (max. 2MB)
                                                </p>
                                            </div>

                                            <input
                                                id="dropzone-file"
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 flex justify-end space-x-3 py-5 px-4">
                        <Button
                            onClick={() => router.push("/admin/events")}
                            className="border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="border border-blue-600 bg-blue-600 px-8 py-2 text-white hover:bg-blue-700 hover:border-blue-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <Spinner size="sm" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                                    </svg>
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}

            {activeTab === "listUserRegistered" && (
                <ListUserRegistered eventId={event.id} />
            )}
        </div>
    );
}
