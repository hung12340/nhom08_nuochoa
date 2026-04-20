export type SeedAccount = {
  id: string;
  username: string;
  displayName: string;
  password: string;
  email: string | null;
  avatarUrl: string | null;
};

export const seedAccounts: SeedAccount[] = [
  {
    id: "seed-linh-huong",
    username: "linhhuong",
    displayName: "Linh Huong",
    password: "Aromis123",
    email: "linh.huong@aromis.demo",
    avatarUrl: null,
  },
  {
    id: "seed-minh-chau",
    username: "minhchau",
    displayName: "Minh Chau",
    password: "Aromis456",
    email: "minh.chau@aromis.demo",
    avatarUrl: null,
  },
  {
    id: "seed-hoang-nam",
    username: "hoangnam",
    displayName: "Hoang Nam",
    password: "Aromis789",
    email: "hoang.nam@aromis.demo",
    avatarUrl: null,
  },
];

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}