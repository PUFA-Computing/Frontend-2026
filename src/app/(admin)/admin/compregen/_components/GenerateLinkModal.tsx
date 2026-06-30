// src/app/(admin)/admin/compregen/_components/GenerateLinkModal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { generateInviteLink } from "@/services/api/cpVcpRegistration";
import { Link2, Copy, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  accessToken: string;
}

export default function GenerateLinkModal({ accessToken }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setCopied(false);
    try {
      const res = await generateInviteLink(accessToken);
      setGeneratedUrl(res.url);
      toast.success("Invite link generated successfully!");
    } catch (error: any) {
      toast.error("Failed to generate invite link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow">
          <Link2 className="h-4 w-4" /> Generate Invite Link
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900 font-bold">Generate Invite Token</DialogTitle>
          <DialogDescription className="text-gray-500">
            Create a unique registration link for CP, VCP1, and VCP2.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {generatedUrl ? (
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-50 p-3 border border-gray-100 flex items-center justify-between gap-2.5 overflow-hidden">
                <span className="text-xs font-mono text-gray-600 truncate flex-1 select-all">
                  {generatedUrl}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCopy}
                  className="h-8 w-8 hover:bg-gray-200 text-gray-500"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                Copy and share this token link with the candidate representatives. It allows precisely one completed registration.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
              <Link2 className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-semibold text-gray-700">No Link Generated Yet</p>
              <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                Click the button below to generate a new active token link.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setGeneratedUrl("");
            }}
            className="border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            Close
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-4 w-4 animate-spin" /> Generating...
              </span>
            ) : generatedUrl ? (
              "Regenerate Link"
            ) : (
              "Generate Token"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
