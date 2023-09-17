export interface User {
  name: string;
  interests: string[];
}

const defaultUser: User = {
  name: "Duane",
  interests: ["Coding", "Biking", "Words ending in 'ing'"],
};

export default defaultUser;
