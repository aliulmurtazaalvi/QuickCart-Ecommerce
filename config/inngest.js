import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest Function to save User data to a Database
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id, 
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`.trim(),
      imgURL: image_url, 
    };

    await connectDB();

    // Use upsert so we don't get duplicate key errors if user already exists
    await User.updateOne(
      { _id: id },
      { $set: userData },
      { upsert: true }
    );
  }
);

// Inngest Function to update user data in Database
export const syncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
  
      const updatedUserData = {
        name: `${first_name} ${last_name}`.trim(),
        email: email_addresses[0].email_address,
        imgURL: image_url, 
      };
  
      await connectDB();
  
      await User.findByIdAndUpdate(id, userData);
    }
  );

// Inngest Function to delete user data from Database

  export const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-from-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
      const { id } = event.data;
  
      await connectDB();
  
      await User.findByIdAndDelete(id);
    }
  );