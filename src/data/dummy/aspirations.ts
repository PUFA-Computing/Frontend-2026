import Aspirations from "@/models/aspiration";

export const dummyAspirations: Aspirations[] = [
    {
        id: 1,
        user_id: "user1",
        subject: "Improve Campus Wi-Fi Coverage",
        message: "The Wi-Fi signal in Building B is very weak, especially on the 3rd floor. Many students have trouble connecting during online classes. Could we get additional access points installed?",
        anonymous: false,
        organization_id: 1,
        closed: false,
        created_at: new Date("2025-04-08T09:30:00"),
        updated_at: new Date("2025-04-08T09:30:00"),
        upvote: 45,
        admin_reply: "",
        organization: {
            name: "IT Infrastructure"
        },
        author: {
            name: "John Doe",
            profile_picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
            verified: true
        }
    },
    {
        id: 2,
        user_id: "user2",
        subject: "Request for Programming Workshop",
        message: "Many students are interested in learning React and Next.js. Could PUFA Computing organize a weekend workshop on modern web development?",
        anonymous: false,
        organization_id: 2,
        closed: true,
        created_at: new Date("2025-04-05T14:20:00"),
        updated_at: new Date("2025-04-06T10:15:00"),
        upvote: 78,
        admin_reply: "Thank you for your suggestion! We're planning a React & Next.js workshop for next month. Details will be announced soon!",
        organization: {
            name: "PUFA Computing"
        },
        author: {
            name: "Jane Smith",
            profile_picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
            verified: true
        }
    },
    {
        id: 3,
        user_id: "user3",
        subject: "Library Hours Extension",
        message: "With finals approaching, could we extend library hours until midnight? Many students need a quiet place to study late into the night.",
        anonymous: true,
        organization_id: 3,
        closed: false,
        created_at: new Date("2025-04-09T16:45:00"),
        updated_at: new Date("2025-04-09T16:45:00"),
        upvote: 92,
        admin_reply: "",
        organization: {
            name: "Library Services"
        },
        author: {
            name: "Anonymous User",
            profile_picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous",
            verified: false
        }
    },
    {
        id: 4,
        user_id: "user4",
        subject: "Suggestion for New Programming Courses",
        message: "Could we add more specialized courses in AI and Machine Learning? The tech industry demand for these skills is growing rapidly.",
        anonymous: false,
        organization_id: 2,
        closed: true,
        created_at: new Date("2025-04-07T11:20:00"),
        updated_at: new Date("2025-04-08T09:00:00"),
        upvote: 65,
        admin_reply: "We're currently reviewing our curriculum and will consider adding AI/ML courses for the next semester. Thank you for the feedback!",
        organization: {
            name: "PUFA Computing"
        },
        author: {
            name: "Alex Johnson",
            profile_picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
            verified: true
        }
    },
    {
        id: 5,
        user_id: "user5",
        subject: "Campus App Bug Report",
        message: "The campus mobile app crashes when trying to view class schedules. This has been happening since the last update.",
        anonymous: false,
        organization_id: 1,
        closed: true,
        created_at: new Date("2025-04-06T13:15:00"),
        updated_at: new Date("2025-04-07T10:30:00"),
        upvote: 32,
        admin_reply: "We've identified the issue and deployed a fix. Please update your app to the latest version.",
        organization: {
            name: "IT Infrastructure"
        },
        author: {
            name: "Sarah Lee",
            profile_picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            verified: true
        }
    }
];
