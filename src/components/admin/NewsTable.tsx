"use client";
import { Fragment, useState } from "react";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from "@headlessui/react";
import { EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { CalendarIcon, ClockIcon, PencilIcon, TrashIcon, UserIcon } from "@heroicons/react/24/outline";
import News from "@/models/news";
import WarningModal from "@/components/ui/WarningModal";
import { deleteNews } from "@/services/api/news";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const organizationColors: any = {
    "PUFA Computing": "bg-gray-900 text-white border-gray-800",
    "PUMA IT": "bg-purple-100 text-purple-800 border-purple-200",
    "PUMA IS": "bg-orange-100 text-orange-800 border-orange-200",
};

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(" ");
}

function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

export default function NewsTable({ news }: { news: News[] }) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const session = useSession();

    const handleDelete = async (id: number) => {
        if (!session.data) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "You must be logged in to delete news",
            });

            return;
        }
        try {
            await deleteNews(id, session.data.user.access_token);

            await Swal.fire({
                icon: "success",
                title: "Success",
                text: "News deleted successfully",
            } as any);
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to delete news",
            });
        } finally {
            setDeleteModalOpen(false);
            window.location.reload();
        }
    };

    // Filter news based on search query
    const filteredNews = news.filter(item => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            item.title.toLowerCase().includes(query) ||
            item.author.toLowerCase().includes(query) ||
            item.organization.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6">
            {/* Search and filter bar */}
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type="text"
                    className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="Search news by title, author or organization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* News list */}
            {filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredNews.map((news) => (
                        <motion.div
                            key={news.id}
                            className="group relative overflow-hidden rounded-xl bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                            whileHover={{ y: -5 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="p-5">
                                {/* Organization badge */}
                                <div className="mb-3">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${organizationColors[news.organization]}`}>
                                        {news.organization}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {news.title}
                                </h3>

                                {/* Author and date */}
                                <div className="mt-3 flex items-center text-xs text-gray-500 gap-x-4">
                                    <div className="flex items-center gap-x-1">
                                        <UserIcon className="h-4 w-4 text-gray-400" />
                                        <span>{news.author}</span>
                                    </div>
                                    <div className="flex items-center gap-x-1">
                                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                                        <span>
                                            {new Date(news.publish_date).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Content preview */}
                                <p className="mt-3 text-sm text-gray-500 line-clamp-3">
                                    {truncateText(news.content, 150)}
                                </p>

                                {/* Action buttons */}
                                <div className="mt-4 flex justify-end gap-2">
                                    <a 
                                        href={`/admin/news/edit/${news.slug}`}
                                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-50 transition-colors"
                                    >
                                        <PencilIcon className="h-4 w-4 mr-1" />
                                        Edit
                                    </a>
                                    <button
                                        onClick={() => {
                                            setSelectedNewsId(news.id);
                                            setDeleteModalOpen(true);
                                        }}
                                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50 transition-colors"
                                    >
                                        <TrashIcon className="h-4 w-4 mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <ClockIcon className="h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No news found</h3>
                    <p className="text-sm text-gray-500 mt-1">Try changing your search query or create a new news article</p>
                </div>
            )}

            <WarningModal
                open={deleteModalOpen}
                title="Delete Confirmation"
                message="Are you sure you want to delete this news article? This action cannot be undone."
                primaryActionText="Delete"
                secondaryActionText="Cancel"
                onClose={() => setDeleteModalOpen(false)}
                onPrimaryAction={() => {
                    if (selectedNewsId !== null) {
                        handleDelete(selectedNewsId).then((r) => r);
                    }
                }}
            />
        </div>
    );
}
