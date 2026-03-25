"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import MemberCard from "@/components/cabinet/MemberCard";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { StaticImageData } from "next/image";
import { Users } from 'lucide-react';

interface SwiperCardProps {
  members: {
    name: string;
    position: string;
    image: string | StaticImageData;
    instagram?: string;
    linkedin?: string;
  }[];
  title?: string;
}

export default function SwiperCard({ members, title = "Division Members" }: SwiperCardProps) {
  return (
    <div className="relative bg-[#F5EDD0] py-20 px-4 md:px-12 lg:px-16 xl:px-24 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[#B8841E]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center border border-[#B8841E]/30 bg-[#FAF5E8]/60 px-4 py-1.5 shadow-parch-sm mb-6">
            <Users className="h-4 w-4 text-[#B8841E] mr-2" />
            <p className="font-serif text-xs tracking-[0.2em] font-medium text-[#B8841E] uppercase">Our Team</p>
          </div>
          <h2 className="font-display italic text-5xl md:text-6xl text-[#0D1B3E] mb-5">
            {title}
          </h2>
          {/* Ornamental rule */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B8841E]/40" />
            <span className="text-[#B8841E]/50 text-xs">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B8841E]/40" />
          </div>
        </div>

        {/* Mobile Swiper (1 slide) */}
        <div className="block md:hidden">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            modules={[Pagination, Autoplay]}
            className="pb-12"
          >
            {members.map((member, index) => (
              <SwiperSlide key={index} className="px-4 py-2">
                <MemberCard
                  name={member.name}
                  position={member.position}
                  image={member.image}
                  instagram={member.instagram}
                  linkedin={member.linkedin}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Tablet Swiper (2 slides) */}
        <div className="hidden md:block lg:hidden">
          <Swiper
            slidesPerView={2}
            spaceBetween={24}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            modules={[Pagination, Navigation, Autoplay]}
            className="pb-12"
          >
            {members.map((member, index) => (
              <SwiperSlide key={index} className="px-2 py-4">
                <MemberCard
                  name={member.name}
                  position={member.position}
                  image={member.image}
                  instagram={member.instagram}
                  linkedin={member.linkedin}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Swiper (4 slides) */}
        <div className="hidden lg:block">
          <Swiper
            slidesPerView={4}
            spaceBetween={24}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            modules={[Pagination, Navigation, Autoplay]}
            className="pb-12"
          >
            {members.map((member, index) => (
              <SwiperSlide key={index} className="px-2 py-4">
                <MemberCard
                  name={member.name}
                  position={member.position}
                  image={member.image}
                  instagram={member.instagram}
                  linkedin={member.linkedin}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
