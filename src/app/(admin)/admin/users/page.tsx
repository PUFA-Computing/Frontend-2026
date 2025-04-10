"use client";
import Title from "@/components/admin/Title";
import UserTable from "@/components/admin/UserTable";
import { GetAllUsers } from "@/services/api/user";
import React from "react";
import User from "@/models/user";
import EditUserModal from "@/app/(admin)/admin/users/_components/EditUserModal";
import ViewVerificationModal from "@/app/(admin)/admin/users/_components/ViewStudentVerificationModal";
// import { useSession } from "next-auth/react"; => to get user session, sekarang belum kepake
export default function UsersList() {
    // const session = useSession(); => to get user session, sekarang belum kepake
    const [users, setUsers] = React.useState<User[]>([]);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [verificationInfo, setVerificationInfo] = React.useState<any | null>(
        null
    );

//     previous code for fetchuser, later on we need this
//     React.useEffect(() => {
//         async function fetchUsers() {
//              if(session.data == null) {
//                 return;
//              }
//            try {
//                const users = await GetUser(session.data.user.access_token);
//                setUsers(users);
//            } catch (error) {
//                console.log(error);
//            }
//        }

//        fetchUsers().then((r) => r);
//    }, [session.data]);

    React.useEffect(() => {
        async function fetchUsers() {
            try {
                console.log('Fetching users...');
                const users = await GetAllUsers();
                console.log('Fetched users:', users);
                setUsers(users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchUsers();
    }, []);

    // Debug: Log users state changes
    React.useEffect(() => {
        console.log('Users state updated:', users);
    }, [users]);

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
        <div className="space-y-6 p-8">
            <Title title="Users" subtitle="Manage all users in the system" />
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
        </div>
    );
}
