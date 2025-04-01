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
    <div className="relative bg-gradient-to-b from-white to-slate-50 py-16 px-4 md:px-12 lg:px-16 xl:px-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-70" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full -ml-48 -mb-48 opacity-70" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="h-6 w-6 text-blue-600" />
            <p className="text-sm font-medium uppercase tracking-wider text-blue-600">Our Team</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            {title}
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Mobile Swiper (1 slide) */}
        <div className="block md:hidden">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
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
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
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
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
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
