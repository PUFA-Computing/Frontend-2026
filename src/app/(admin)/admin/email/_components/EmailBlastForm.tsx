'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Textarea } from "@/components/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const teams = [
  { id: 'all-teams', label: 'All Teams' },
  { id: 'pufa-computing', label: 'PUFA Computing' },
  { id: 'puma-informatics', label: 'PUMA Informatics' },
  { id: 'puma-information-system', label: 'PUMA Information System' },
];

const typeStyles = {
  event: {
    icon: <CalendarIcon className="h-5 w-5" />,
    text: 'Event',
    activeClass: 'border-[#02ABF3] bg-[#EBF8FE] text-[#02ABF3]',
    inactiveClass: 'border-gray-200 text-gray-600 hover:bg-white/90'
  },
  news: {
    icon: <NewsIcon className="h-5 w-5" />,
    text: 'News',
    activeClass: 'border-[#02ABF3] bg-[#EBF8FE] text-[#02ABF3]',
    inactiveClass: 'border-gray-200 text-gray-600 hover:bg-white/90'
  },
  meeting: {
    icon: <UsersIcon className="h-5 w-5" />,
    text: 'Meeting',
    activeClass: 'border-[#02ABF3] bg-[#EBF8FE] text-[#02ABF3]',
    inactiveClass: 'border-gray-200 text-gray-600 hover:bg-white/90'
  }
};

export default function EmailBlastForm() {
  const [selectedType, setSelectedType] = useState<'event' | 'news' | 'meeting'>('event');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all-teams');
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleTeamSelection = (teamId: string) => {
    setSelectedTeam(teamId);
  };

  // Reset form when notification type changes
  useEffect(() => {
    setEmailSubject('');
    setEmailContent('');
  }, [selectedType]);

  // Auto-hide success message after 4 seconds
  useEffect(() => {
    if (sendStatus?.success) {
      const timer = setTimeout(() => {
        setSendStatus(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [sendStatus]);

  const getTypeSpecificContent = () => {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    switch (selectedType) {
      case 'event':
        return {
          title: 'Event Notification',
          subject: 'New Event: [Event Name]',
          content: `Dear Computizen,

Event Details:
- Date: ${currentDate}
- Time: [Time]
- Location: [Location]

[Event Description]

Registration:
[Registration Details]

Best regards,
PUFA Computing Team`,
        };
      case 'news':
        return {
          title: 'News Announcement',
          subject: 'Latest News Update',
          content: `Dear Computizen,

[News Content]

Important Updates:
- [Update 1]
- [Update 2]
- [Update 3]

Best regards,
PUFA Computing Team`,
        };
      case 'meeting':
        return {
          title: 'Meeting Invitation',
          subject: 'Meeting Invitation: [Meeting Title]',
          content: `Dear Computizen,

Meeting Details:
- Date: ${currentDate}
- Time: [Time]
- Location: [Location]

Agenda:
1. [Agenda 1]
2. [Agenda 2]
3. [Agenda 3]

Best regards,
PUFA Computing Team`,
        };
    }
  };

  const typeContent = getTypeSpecificContent();

  return (
    <div className="max-w-7xl mx-auto px-4 pb-6 w-full">
      <div className="mb-6 px-2">
        <h1 className="text-xl md:text-2xl font-semibold mb-2">Email Blast</h1>
        <p className="text-sm md:text-base text-gray-500">Send automated email notifications to team members</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6">
        <div>
          {/* Left Column */}
          <div className="mb-8 border rounded-lg p-6 bg-white/90">
            <h2 className="text-sm font-medium mb-4">Select Notification Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['event', 'news', 'meeting'] as const).map(type => (
                <button
                  key={type}
                  className={`flex items-center justify-center gap-2 py-4 sm:py-8 px-4 border rounded-lg transition-colors ${selectedType === type ? typeStyles[type].activeClass : typeStyles[type].inactiveClass}`}
                  onClick={() => setSelectedType(type)}
                >
                  {typeStyles[type].icon}
                  {typeStyles[type].text}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8 border rounded-lg p-6 bg-white/90">
            <h2 className="text-base font-medium mb-4">{typeContent.title}</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm text-gray-600 mb-2">
                  Email Subject
                </label>
                <Input
                  id="subject"
                  placeholder="Email subject"
                  value={emailSubject || typeContent.subject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="text-sm sm:text-base w-full border-gray-300 focus:border-[#02ABF3] focus:ring-[#02ABF3]"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm text-gray-600 mb-2">
                  Email Content
                </label>
                <Textarea
                  id="content"
                  placeholder="Email content"
                  value={emailContent || typeContent.content}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="min-h-[150px] sm:min-h-[200px] text-sm sm:text-base w-full border-gray-300 focus:border-[#02ABF3] focus:ring-[#02ABF3] font-mono whitespace-pre-wrap"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:justify-end mt-6">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto px-6 py-2 border-[#02ABF3] text-[#02ABF3] hover:bg-[#02ABF3] hover:text-white transition-colors"
              onClick={() => setShowPreview(true)}
            >
              Preview
            </Button>
            <Button 
              className="w-full sm:w-auto px-6 py-2 bg-[#02ABF3] text-white border-[#02ABF3] hover:bg-white hover:text-[#02ABF3] transition-colors"
              onClick={async () => {
                try {
                  setIsSending(true);
                  setSendStatus(null);
                  
                  const response = await fetch('/api/email', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      subject: emailSubject || typeContent?.subject,
                      content: emailContent || typeContent?.content,
                      team: selectedTeam,
                    }),
                  });

                  const data = await response.json();
                  
                  if (data.success) {
                    // Reset form first
                    setEmailSubject('');
                    setEmailContent('');
                    setSelectedType('event');
                    // Then show success message (will auto-hide after 4 seconds)
                    setSendStatus({
                      success: true,
                      message: 'Email sent successfully!'
                    });
                  } else {
                    throw new Error(data.message);
                  }
                } catch (error) {
                  setSendStatus({
                    success: false,
                    message: 'Failed to send email. Please try again.'
                  });
                } finally {
                  setIsSending(false);
                }
              }}
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send Email'}
            </Button>
            {sendStatus && (
              <div className="fixed top-8 right-4 left-4 sm:left-auto sm:right-12 z-[100] transition-all duration-300 transform">
                <div className={`p-4 rounded-lg shadow-lg ${sendStatus.success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} max-w-md ml-auto`}>
                  <div className="flex items-center gap-2">
                    {sendStatus.success ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {sendStatus.message}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="mb-8 border rounded-lg p-6 bg-white/90">
            <h2 className="text-sm font-medium mb-4">Select Recipients</h2>
            <div className="grid gap-2">
              {[...teams].map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleTeamSelection(team.id)}
                  className={`w-full px-4 py-2.5 text-sm text-left border rounded-lg transition-colors
                    ${selectedTeam === team.id
                      ? 'border-[#02ABF3] bg-[#EBF8FE] text-[#02ABF3]'
                      : 'border-gray-200 text-gray-600 hover:bg-white/90'}`}
                >
                  {team.label}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium mb-3">Recipients Info</h3>
              <div className="text-sm text-gray-500 space-y-1">
                {selectedTeam === 'all-teams' ? (
                  <>
                    <p>Email will be sent to all registered users from all teams</p>
                    <p>Only users with verified student email addresses will receive the notification</p>
                  </>
                ) : (
                  <>
                    <p>Email will be sent to registered users from selected team:</p>
                    <p className="text-[#02ABF3]">
                      {teams.find(t => t.id === selectedTeam)?.label}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="w-[calc(100%-32px)] max-w-[600px] bg-white border-0 mx-4">
          <DialogHeader className="border-b border-[#afafb0] pb-4">
            <DialogTitle className="text-black">Email Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2 text-[#696969]">Subject</h3>
              <p className="text-black">{emailSubject || typeContent?.subject}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2 text-[#696969]">Recipients</h3>
              <p className="text-black">{selectedTeam === 'all-teams' ? 'All verified users from all teams' : `Users from ${teams.find(t => t.id === selectedTeam)?.label}`}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2 text-[#696969]">Content</h3>
              <div className="whitespace-pre-wrap text-black p-4 sm:p-6 bg-white/90 rounded-lg border border-[#afafb0] text-sm sm:text-base">
                {emailContent || typeContent?.content}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}

function NewsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
      />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
}
