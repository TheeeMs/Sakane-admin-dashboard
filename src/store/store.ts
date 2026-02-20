import { create } from "zustand";
import { courses, mentors } from "./data";
import type { Course } from "@/types/Course";
import type { Mentor } from "@/types/mentor";

type StoreState = {
    courses: Course[];
    mentors: Mentor[];
};

export const useStore = create<StoreState>(() => ({
    courses,
    mentors,
}));
