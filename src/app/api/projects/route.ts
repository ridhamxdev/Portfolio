import { NextResponse } from 'next/server';

// Define the Project type
interface Project {
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  demoUrl?: string;
  sourceUrl?: string;
}

const projectsData: Project[] = [
  {
    title: "Energence",
    description: "Full-stack renewable energy platform that predicts and optimizes solar and wind power generation using machine learning",
    tags: ["React.js, Django, TensorFlow, REST API, SQLite, Git"],
    sourceUrl: "https://github.com/ridhamxdev/Energence",
    demoUrl: undefined
  },
  {
    title: "TaskNexus", // Corrected: Removed leading space
    description: "Implements a secure Node.js-based system for email notifications and financial transactions using MySQL and Sequelize ORM",
    tags: [" Node.js, Git, Express.js, MongoDB, Sequelize with MySQL, RabbitMQ, Redis"],
    demoUrl: undefined,
    sourceUrl: "https://github.com/ridhamxdev/TaskNexus/tree/mysql-migration"
  },
  {
    title: "Authora",
    description: "Full-featured e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js) for a seamless shopping experience.",
    tags: [" React.js, Node.js, Nest.js, MongoDB, Git"],
    demoUrl: undefined,
    sourceUrl: "https://github.com/ridhamxdev/Authora",
  }
];

export async function GET() {
  // In a real application, you would fetch this data from a database
  // or perform other Node.js-based processing here.
  // For now, we are serving the hardcoded data.
  return NextResponse.json(projectsData);
} 