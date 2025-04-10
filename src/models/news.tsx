// import { v4 as uuid } from "uuid";
// interface News {
//    id: number;
//    title: string;
//    content: string;
//    user_id: typeof uuid;
//    publish_date: Date;
//    likes: number;
//    created_at: Date;
//    updated_at: Date;
//    thumbnail: string;
//    slug: string;
//    organization: string;
//    author: string;
// }

// export default News;

interface News {
   id: number;
   title: string;
   content: string;
   user_id: number; // Changed from uuid to number since we're using dummy data
   publish_date: Date;
   likes: number;
   created_at: Date;
   updated_at: Date;
   thumbnail: string;
   slug: string;
   organization: string;
   organization_id: number;
   author: string;
}

export default News;