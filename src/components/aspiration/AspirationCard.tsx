"use client";
import React, { useState } from "react";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import Aspiration from "@/models/aspiration";
import { AiFillCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FaReply, FaRegClock } from "react-icons/fa";
import { motion } from "framer-motion";

type AspirationCardProps = {
    aspiration: Aspiration;
};

const AspirationCard: React.FC<AspirationCardProps> = ({ aspiration }) => {
    const [showAdminReply, setShowAdminReply] = useState(false);

    // Handler untuk menampilkan atau menyembunyikan balasan admin
    const toggleAdminReply = () => {
        setShowAdminReply(!showAdminReply);
    };
    // like icon
    const [liked, setLiked] = useState(false);

    const toggleLike = () => {
        setLiked(!liked);
    };

    const dateConvert = (date: Date) => {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        return `${date.getDate().toString().padStart(2, "0")} ${
            months[date.getMonth()]
        } ${date.getFullYear().toString().padStart(2, "0")}`;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
        >
            {/* Card Header */}
            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4 md:p-5">
                <div className="flex items-start justify-between">
                    <h3 className="break-words text-lg font-bold capitalize text-gray-900 md:text-xl">
                        {aspiration.subject}
                    </h3>
                    {aspiration.admin_reply && (
                        <button
                            onClick={toggleAdminReply}
                            className={`ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-blue-100 hover:text-blue-600 md:ml-4 ${showAdminReply ? "bg-blue-100 text-blue-600" : ""}`}
                            aria-label="Toggle admin reply"
                        >
                            <FaReply className={`text-sm transition-transform ${showAdminReply ? "rotate-180" : ""}`} />
                        </button>
                    )}
                </div>
            </div>
            
            {/* Card Body */}
            <div className="flex-grow p-4 md:p-5">
                <p className="mb-4 whitespace-pre-line text-gray-700">
                    {aspiration.message}
                </p>
                
                {/* Admin Reply Section */}
                {aspiration.admin_reply && (
                    <div className={`mt-4 overflow-hidden transition-all ${showAdminReply ? "max-h-96" : "max-h-0"}`}>
                        <div className="rounded-lg bg-blue-50 p-4">
                            <div className="mb-2 font-medium text-blue-800">Admin Response:</div>
                            <p className="text-blue-700">
                                {aspiration.admin_reply}
                            </p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Card Footer */}
            <div className="border-t border-gray-100 bg-gray-50 p-4 md:p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    {/* Author Info */}
                    <div className="flex items-center">
                        <span className="mr-2 text-sm font-medium text-gray-700">From:</span>
                        <span className="flex items-center text-sm font-medium text-gray-900">
                            {aspiration.anonymous ? (
                                "Anonymous"
                            ) : (
                                <>
                                    {aspiration.author.name}
                                    {aspiration.author.verified ? (
                                        <AiFillCheckCircle
                                            className="ml-2 text-blue-500"
                                            title="Student ID Verified"
                                        />
                                    ) : (
                                        <AiOutlineCloseCircle
                                            className="ml-2 text-red-500"
                                            title="Student ID Still Not Verified"
                                        />
                                    )}
                                </>
                            )}
                        </span>
                    </div>
                    
                    {/* Organization and Date */}
                    <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">To: {aspiration.organization.name}</span>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                            <FaRegClock className="mr-1 text-xs" />
                            <span>{dateConvert(aspiration.updated_at)}</span>
                        </div>
                    </div>
                </div>
                
                {/* Like Button - Uncomment when implementing likes */}
                {/* <div className="mt-3 flex justify-end border-t border-gray-100 pt-3 md:mt-0 md:border-0 md:pt-0">
                    <button
                        onClick={toggleLike}
                        className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-gray-700 transition-all hover:bg-red-50 hover:text-red-500"
                    >
                        {liked ? (
                            <IoIosHeart className="text-xl text-red-500" />
                        ) : (
                            <IoIosHeartEmpty className="text-xl" />
                        )}
                        <span className="text-sm font-medium">{aspiration.upvote}</span>
                    </button>
                </div> */}
            </div>
        </motion.div>
    );
};

export default AspirationCard;
