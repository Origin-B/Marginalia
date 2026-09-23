type Str = string;
type Num = number;

interface Deadline {
  targetDate: Str;
  startDate: Str;
  startPage: Num;
}

interface Note {
  id: Str;
  kind: "reflection" | "open-question";
  text: Str;
  entryDate: Str;
  createdAt: Str;
  updatedAt: Str;
}

interface Book {
  id: Str;
  coverURL?: Str;
  title: Str;
  author: Str;
  description: Str;
  totalPages: Num;
}

interface SavedBook extends Book {
  addedAt: Str;
  currentPage: Num;
  status: "want-to-read" | "reading" | "finished";
  notes?: Note[];
  deadline?: Deadline;
}

interface BookMarkList {
  bookMarkList: SavedBook[];
}

interface Guest extends BookMarkList {
  type: "guest";
}

interface User extends BookMarkList {
  type: "user";
  firstName: Str;
  lastName: Str;
  email: Str;
  password: Str;
}

type Person = Guest | User;

export type {
  Person,
  Book,
  Guest,
  User,
  BookMarkList,
  SavedBook,
  Note,
  Deadline,
};
