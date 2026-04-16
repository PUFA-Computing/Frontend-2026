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
            className="flex flex-col overflow-hidden rounded-xl border border-[#B8841E]/20 bg-[#FAF5E8] shadow-parch-sm transition-all hover:shadow-parch-md hover:border-[#B8841E]/40"
        >
            {/* Card Header */}
            <div className="border-b border-[#B8841E]/15 bg-[#F5EDD0]/50 p-4 md:p-5">
                <div className="flex items-start justify-between">
                    <h3 className="break-words text-xl font-display font-bold capitalize text-[#0D1B3E] md:text-2xl tracking-tight leading-tight">
                        {aspiration.subject}
                    </h3>
                    {aspiration.admin_reply && (
                        <button
                            onClick={toggleAdminReply}
                            className={`ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all md:ml-4 ${showAdminReply ? "bg-[#B8841E]/20 text-[#B8841E]" : "bg-[#E5D5A5]/40 text-[#1A1A2E]/50 hover:bg-[#B8841E]/10 hover:text-[#B8841E]"}`}
                            aria-label="Toggle admin reply"
                        >
                            <FaReply className={`text-sm transition-transform duration-300 ${showAdminReply ? "rotate-180" : ""}`} />
                        </button>
                    )}
                </div>
            </div>
            
            {/* Card Body */}
            <div className="flex-grow p-4 md:p-6">
                <p className="mb-4 whitespace-pre-line text-[#1A1A2E]/80 font-serif text-[15px] leading-relaxed">
                    {aspiration.message}
                </p>
                
                {/* Admin Reply Section */}
                {aspiration.admin_reply && (
                    <div className={`mt-5 overflow-hidden transition-all duration-300 ${showAdminReply ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                        <div className="rounded-lg bg-white/60 p-5 border border-[#B8841E]/20 shadow-inner relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#B8841E] rounded-l-lg"></div>
                            <div className="mb-2 font-display font-semibold text-[#0D1B3E] tracking-tight">Admin Response:</div>
                            <p className="text-[#1A1A2E]/75 font-serif text-[15px] leading-relaxed">
                                {aspiration.admin_reply}
                            </p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Card Footer */}
            <div className="border-t border-[#B8841E]/15 bg-[#E5D5A5]/10 p-4 md:p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    {/* Author Info */}
                    <div className="flex items-center">
                        <span className="mr-2 text-[11px] uppercase tracking-widest font-serif font-bold text-[#B8841E]">From:</span>
                        <span className="flex items-center text-sm font-medium font-serif text-[#0D1B3E]">
                            {aspiration.anonymous ? (
                                "Anonymous"
                            ) : (
                                <>
                                    {aspiration.author.name}
                                    {aspiration.author.verified ? (
                                        <AiFillCheckCircle
                                            className="ml-1.5 text-green-600"
                                            title="Student ID Verified"
                                        />
                                    ) : (
                                        <AiOutlineCloseCircle
                                            className="ml-1.5 text-red-500"
                                            title="Student ID Still Not Verified"
                                        />
                                    )}
                                </>
                            )}
                        </span>
                    </div>
                    
                    {/* Organization and Date */}
                    <div className="flex items-center text-xs font-serif text-[#1A1A2E]/60">
                        <span className="mr-2 px-2 py-0.5 bg-[#FAF5E8] border border-[#B8841E]/20 rounded text-[#0D1B3E] font-medium shadow-sm">To: {aspiration.organization.name}</span>
                        <span className="mx-1 text-[#B8841E]/40">•</span>
                        <div className="flex items-center bg-[#FAF5E8] border border-[#B8841E]/10 rounded px-2 py-0.5">
                            <FaRegClock className="mr-1.5 text-[#B8841E]" />
                            <span className="font-medium text-[#1A1A2E]/80">{dateConvert(aspiration.updated_at)}</span>
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
