"use client";
import Title from "@/components/admin/Title";
import UserTable from "@/components/admin/UserTable";
import { GetUser } from "@/services/api/user";
import React from "react";
import User from "@/models/user";
import EditUserModal from "@/app/(admin)/admin/users/_components/EditUserModal";
import ViewVerificationModal from "@/app/(admin)/admin/users/_components/ViewStudentVerificationModal";
import { useSession } from "next-auth/react";

export default function UsersList() {
	const session = useSession();
    const [users, setUsers] = React.useState<User[]>([]);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [verificationInfo, setVerificationInfo] = React.useState<any | null>(
        null
    );

    React.useEffect(() => {
		 async function fetchUsers() {
			  if(session.data == null) {
				 return;
			  }
            try {
                // Use our new endpoint that returns all users with basic fields
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                const allUsersUrl = `${baseUrl}/api/v1/admin/users/basic`;
                
                console.log('Fetching all users from:', allUsersUrl);
                const response = await fetch(allUsersUrl, {
                    headers: {
                        'Authorization': `Bearer ${session.data.user.access_token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch users: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('All users response:', data);
                
                if (data && data.success && Array.isArray(data.data)) {
                    setUsers(data.data);
                    console.log(`Successfully fetched ${data.data.length} users from the database`);
                } else {
                    console.error('Unexpected API response format:', data);
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                console.error('Error fetching all users:', error);
                
                // If the new endpoint fails, try a direct database query approach
                try {
                    console.log('Trying direct database query approach...');
                    // Make a direct query to the database to get all users
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                    const dbQueryUrl = `${baseUrl}/api/v1/admin/users`; // Fallback to original endpoint
                    
                    const dbResponse = await fetch(dbQueryUrl, {
                        headers: {
                            'Authorization': `Bearer ${session.data.user.access_token}`
                        }
                    });
                    
                    if (!dbResponse.ok) {
                        throw new Error(`Failed to fetch users from database: ${dbResponse.status}`);
                    }
                    
                    const dbData = await dbResponse.json();
                    
                    if (dbData && dbData.success && Array.isArray(dbData.data)) {
                        setUsers(dbData.data);
                        console.log(`Successfully fetched ${dbData.data.length} users from direct database query`);
                    } else {
                        throw new Error('Invalid database response format');
                    }
                } catch (dbError) {
                    console.error('Error with direct database query:', dbError);
                    
                    // Last resort: Fetch individual users
                    try {
                        console.log('Trying to fetch individual users...');
                        const userIds = [];
                        
                        // Try to fetch users with sequential IDs
                        // This is our last resort fallback
                        for (let i = 1; i <= 20; i++) {
                            userIds.push(i.toString());
                        }
                        
                        const fetchedUsers: User[] = [];
                        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                        
                        // Try to fetch each user by ID
                        for (const userId of userIds) {
                            try {
                                const userUrl = `${apiBaseUrl}/api/v1/user/${userId}`;
                                const userResponse = await fetch(userUrl, {
                                    headers: {
                                        'Authorization': `Bearer ${session.data.user.access_token}`
                                    }
                                });
                                
                                if (userResponse.ok) {
                                    const userData = await userResponse.json();
                                    if (userData && userData.success && userData.data) {
                                        fetchedUsers.push(userData.data);
                                    }
                                }
                            } catch (e) {
                                // Ignore errors for individual users
                            }
                        }
                        
                        if (fetchedUsers.length > 0) {
                            setUsers(fetchedUsers);
                            console.log(`Successfully fetched ${fetchedUsers.length} individual users`);
                        } else {
                            throw new Error('Could not fetch any users');
                        }
                    } catch (individualError) {
                        console.error('All approaches failed:', individualError);
                        setUsers([]);
                    }
                }
            }
        }

        fetchUsers().then((r) => r);
    }, [session.data]);

    const openModal = (user: User) => {
        setSelectedUser(user);
    };

    const closeModal = () => {
        setSelectedUser(null);
    };

    const openVerificationModal = (info: any) => {
        setVerificationInfo(info);
    };

    const closeVerificationModal = () => {
        setVerificationInfo(null);
    };

    return (
        <div>
            <UserTable
                users={users}
                onEditClick={openModal}
                onViewVerification={openVerificationModal}
            />
            {selectedUser && (
                <EditUserModal user={selectedUser} onClose={closeModal} />
            )}

            {verificationInfo && (
                <ViewVerificationModal
                    verificationInfo={verificationInfo}
                    onClose={closeVerificationModal}
                />
            )}
        </div>
    );
}