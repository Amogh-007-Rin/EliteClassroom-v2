import express from "express";
const PORT = 3000;
const app = express();
app.use(express.json());

import { prisma } from './prisma.js'

async function main() {
  // Create a new user with a post
  const user = await prisma.user.create({
    data: {
      name: 'Aliceaaaaaaa',
      email: 'alice@prisma.iokkaa',
      posts: {
        create: {
          title: 'Hello Worldaaaa',
          content: 'This is aamy first postaaaa!',
          published: true,
        },
      },
    },
    include: {
      posts: true,
    },
  })
  console.log('Created user:', user)

  // Fetch all users with their posts
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  })
  console.log('All users:', JSON.stringify(allUsers, null, 2))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

















app.get("/", (req : any, res: any) => {
    res.json({
        message : "server is running ",
        condition : "all set"
    });
});

app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})