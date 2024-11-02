import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Initialize in-memory database
const inMemoryDB = {
  "event": [
    {
      "name": "Tech Safari Mixer",
      "date": "2024-09-30",
      "description": "A networking mixer with industry professionals from tech sectors.",
      "numSpeaker": 1,
      "speaker": [
        "Guest Panel"
      ],
      "status": "Completed",
      "updatedAt": "2024-10-31T21:32:31.606Z",
      "deletedAt": "2024-10-31T19:41:36.285Z"
    },
    {
      "name": "E-Commerce Innovations Expo",
      "date": "2024-10-27",
      "description": "Showcasing innovations in the e-commerce industry.",
      "numSpeaker": 1,
      "speaker": [
        "Jessica Adams"
      ],
      "status": "Completed",
      "updatedAt": "2024-10-31T17:21:33.760Z"
    },
    {
      "name": "Digital Transformation Workshop",
      "date": "2024-11-10",
      "description": "Workshops on how businesses can leverage digital transformation.",
      "numSpeaker": 3,
      "speaker": [
        "Daniel Brown",
        "Helen Park",
        "Michelle White",
        "Medic nelz"
      ],
      "status": "In Progress",
      "location": "Benin City, Edo state Nigeria",
      "updatedAt": "2024-10-31T21:29:11.610Z"
    },
    {
      "name": "VR and AR for Education Summit",
      "date": "2024-12-10",
      "description": "Exploring the use of VR and AR in education.",
      "numSpeaker": 2,
      "speaker": [
        "Dr. Samantha Johnson",
        "Erik Thompson"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Green Technologies Conference",
      "date": "2024-10-12",
      "description": "A conference on sustainable and green technologies.",
      "numSpeaker": 4,
      "speaker": [
        "Richard Evans",
        "Sophia Lee",
        "Grace Morgan",
        "Jason Taylor"
      ],
      "status": "Completed"
    },
    {
      "name": "Cryptocurrency Insights Workshop",
      "date": "2024-10-31",
      "description": "An in-depth workshop on the current state of cryptocurrencies.",
      "numSpeaker": 2,
      "speaker": [
        "Carlos Diaz",
        "Anna Stuart",
        "Ewere Charles"
      ],
      "status": "In Progress",
      "location": "Nigeria",
      "updatedAt": "2024-10-31T21:54:14.836Z"
    },
    {
      "name": "Space Exploration Symposium",
      "date": "2024-12-08",
      "description": "Exploring advancements in space exploration and research.",
      "numSpeaker": 3,
      "speaker": [
        "Dr. Elizabeth Turner",
        "Mark Spencer",
        "Dr. Henry Lee"
      ],
      "status": "Completed",
      "updatedAt": "2024-10-31T20:08:53.001Z"
    },
    {
      "name": "HealthTech Innovations Forum",
      "date": "2024-11-15",
      "description": "Forum on the latest innovations in health technology.",
      "numSpeaker": 2,
      "speaker": [
        "Linda Young",
        "Dr. Richard Collins"
      ],
      "status": "In Progress"
    },
    {
      "name": "5G and Beyond Summit",
      "date": "2024-12-20",
      "description": "A summit on the future of 5G technology and its applications.",
      "numSpeaker": 3,
      "speaker": [
        "John Parker",
        "Eve Harper",
        "George Matthews"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Autonomous Vehicles Symposium",
      "date": "2024-11-30",
      "description": "Discussing the advancements and future of autonomous vehicles.",
      "numSpeaker": 2,
      "speaker": [
        "Robert James",
        "Clara Ross"
      ],
      "status": "In Progress"
    },
    {
      "name": "Augmented Reality Gaming Forum",
      "date": "2024-10-28",
      "description": "A forum on AR gaming and its impact on the industry.",
      "numSpeaker": 1,
      "speaker": [
        "Ethan Walker"
      ],
      "status": "Completed"
    },
    {
      "name": "Cyber Warfare Conference",
      "date": "2024-12-03",
      "description": "A conference on the emerging threats in cyber warfare.",
      "numSpeaker": 3,
      "speaker": [
        "Dr. Victor Hill",
        "Caroline O'Connor",
        "Simon Brown"
      ],
      "status": "Upcoming"
    },
    {
      "name": "EdTech Innovations Expo",
      "date": "2024-11-07",
      "description": "An expo on the latest trends and innovations in education technology.",
      "numSpeaker": 2,
      "speaker": [
        "Nicole Martin",
        "Harold Lee"
      ],
      "status": "In Progress"
    },
    {
      "name": "Sustainable Urban Development Conference",
      "date": "2024-10-29",
      "description": "Exploring sustainable practices in urban development.",
      "numSpeaker": 3,
      "speaker": [
        "Monica Green",
        "William Howard",
        "Sarah Carter"
      ],
      "status": "Completed"
    },
    {
      "name": "Digital Nomad Summit",
      "date": "2024-11-25",
      "description": "A summit on the rise of the digital nomad lifestyle.",
      "numSpeaker": 2,
      "speaker": [
        "Michael Scott",
        "Emma Davis"
      ],
      "status": "Upcoming"
    },
    {
      "name": "AI and Automation in Business Workshop",
      "date": "2024-12-05",
      "description": "A workshop on AI and automation solutions for businesses.",
      "numSpeaker": 2,
      "speaker": [
        "David Blake",
        "Sarah Peterson"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Tech for Social Good Forum",
      "date": "2024-11-22",
      "description": "Exploring how technology can be used to drive social good and positive change.",
      "numSpeaker": 3,
      "speaker": [
        "Lisa Brown",
        "Edward Thompson",
        "Rachel Green"
      ],
      "status": "In Progress"
    },
    {
      "name": "Cloud Security Expo",
      "date": "2024-12-18",
      "description": "An expo on the latest trends and challenges in cloud security.",
      "numSpeaker": 2,
      "speaker": [
        "Oliver Clark",
        "Dr. Hannah Stone"
      ],
      "status": "Upcoming"
    },
    {
      "name": "AI-Powered Personalization Conference",
      "date": "2024-12-22",
      "description": "A conference on how AI is being used to create personalized customer experiences.",
      "numSpeaker": 1,
      "speaker": [
        "Matthew Jones"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Digital Privacy and Ethics Symposium",
      "date": "2024-10-31",
      "description": "Discussing the ethical implications and privacy concerns of digital technologies.",
      "numSpeaker": 4,
      "speaker": [
        "Samantha Lee",
        "Dr. Brian Cooper",
        "Laura James",
        "Elena Rossi"
      ],
      "status": "Completed"
    },
    {
      "name": "Tech-Driven Philanthropy Forum",
      "date": "2024-12-06",
      "description": "Exploring how technology is reshaping philanthropy and charitable giving.",
      "numSpeaker": 2,
      "speaker": [
        "Katherine Young",
        "David Morales"
      ],
      "status": "Upcoming"
    },
    {
      "name": "5G in Telecommunications Workshop",
      "date": "2024-11-17",
      "description": "A workshop on the transformative effects of 5G in telecommunications.",
      "numSpeaker": 3,
      "speaker": [
        "Samuel White",
        "Helen Garcia",
        "Paul Adams"
      ],
      "status": "In Progress"
    },
    {
      "name": "Machine Learning for Cybersecurity",
      "date": "2024-11-28",
      "description": "Discussing the role of machine learning in enhancing cybersecurity.",
      "numSpeaker": 2,
      "speaker": [
        "Dr. Olivia Baker",
        "Ryan Wells"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Immersive Learning Technologies Conference",
      "date": "2024-12-16",
      "description": "A conference on how immersive technologies like AR and VR are transforming education.",
      "numSpeaker": 3,
      "speaker": [
        "Emma Walker",
        "Charles Griffin",
        "Sophia Brooks"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Women in Tech Leadership Summit",
      "date": "2024-12-04",
      "description": "A summit focused on empowering women in technology leadership roles.",
      "numSpeaker": 4,
      "speaker": [
        "Jennifer Davis",
        "Sarah Martin",
        "Nina Watson",
        "Lisa Patel"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Future of Robotics in Healthcare",
      "date": "2024-11-29",
      "description": "Exploring how robotics is revolutionizing healthcare practices.",
      "numSpeaker": 2,
      "speaker": [
        "Dr. Alan Reed",
        "Jessica Taylor"
      ],
      "status": "In Progress"
    },
    {
      "name": "Tech for Climate Action Forum",
      "date": "2024-12-02",
      "description": "A forum discussing how technology can help tackle climate change.",
      "numSpeaker": 3,
      "speaker": [
        "Dr. Angela Howard",
        "Mark Richards",
        "Emily Clark"
      ],
      "status": "Upcoming"
    },
    {
      "name": "EdTech Leadership Forum",
      "date": "2024-10-30",
      "description": "A forum on leadership in the rapidly evolving field of education technology.",
      "numSpeaker": 1,
      "speaker": [
        "Dr. Steven Foster"
      ],
      "status": "Completed"
    },
    {
      "name": "Innovations in Green Energy",
      "date": "2024-11-14",
      "description": "An event showcasing the latest innovations in green and renewable energy.",
      "numSpeaker": 3,
      "speaker": [
        "Diana Evans",
        "Robert Parker",
        "Elena Moore"
      ],
      "status": "In Progress"
    },
    {
      "name": "Tech and Diversity Symposium",
      "date": "2024-12-14",
      "description": "Exploring diversity in the tech industry and how to create more inclusive workplaces.",
      "numSpeaker": 4,
      "speaker": [
        "Tina Roberts",
        "Michael Carter",
        "Laura Perry",
        "Dr. Sylvia Grant"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Blockchain for Supply Chain Management",
      "date": "2024-11-18",
      "description": "Discussing the role of blockchain in transforming supply chain operations.",
      "numSpeaker": 1,
      "speaker": [
        "Daniel Harris"
      ],
      "status": "In Progress"
    },
    {
      "name": "Quantum Computing Breakthroughs",
      "date": "2024-11-30",
      "description": "A symposium on the latest developments and breakthroughs in quantum computing.",
      "numSpeaker": 2,
      "speaker": [
        "Dr. John Miller",
        "Alice Monroe"
      ],
      "status": "Upcoming"
    },
    {
      "name": "AI for Sustainable Agriculture",
      "date": "2024-12-09",
      "description": "Exploring how artificial intelligence is transforming agriculture and food production.",
      "numSpeaker": 3,
      "speaker": [
        "James Wilson",
        "Dr. Emily Peterson",
        "Sophia Turner"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Future of Transportation Technologies",
      "date": "2024-11-11",
      "description": "A conference discussing autonomous vehicles, EVs, and the future of transportation.",
      "numSpeaker": 2,
      "speaker": [
        "Jason Taylor",
        "Dr. Linda Brooks"
      ],
      "status": "In Progress"
    },
    {
      "name": "Tech in Financial Inclusion",
      "date": "2024-10-26",
      "description": "A forum discussing how technology can drive financial inclusion in underserved communities.",
      "numSpeaker": 3,
      "speaker": [
        "Oliver Young",
        "Megan Foster",
        "Dr. Laura Green"
      ],
      "status": "Completed"
    },
    {
      "name": "Next-Gen Cybersecurity Strategies",
      "date": "2024-11-23",
      "description": "A conference on cutting-edge strategies to protect against cybersecurity threats.",
      "numSpeaker": 2,
      "speaker": [
        "Kevin Harrison",
        "Emily Zhang"
      ],
      "status": "Upcoming"
    },
    {
      "name": "AI in Autonomous Systems",
      "date": "2024-12-03",
      "description": "A workshop on the integration of AI into autonomous systems and robotics.",
      "numSpeaker": 1,
      "speaker": [
        "Dr. Peter Clarke"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Wearable Tech Summit",
      "date": "2024-11-19",
      "description": "Exploring innovations in wearable technology and its future applications.",
      "numSpeaker": 3,
      "speaker": [
        "Lisa Howard",
        "John Roberts",
        "Dr. Susan Taylor"
      ],
      "status": "In Progress"
    },
    {
      "name": "AI-Driven Healthcare Innovations",
      "date": "2024-12-07",
      "description": "Discussing the role of AI in revolutionizing healthcare technologies and systems.",
      "numSpeaker": 2,
      "speaker": [
        "David Clark",
        "Dr. Maria Roberts"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Tech for Smart Cities",
      "date": "2024-12-10",
      "description": "A forum on the use of technology in creating and managing smart cities.",
      "numSpeaker": 4,
      "speaker": [
        "Jane Harris",
        "Michael Lee",
        "Dr. Tom Jackson",
        "Megan Adams"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Sustainable Tech Innovations",
      "date": "2024-10-20",
      "description": "A showcase of sustainable technologies aimed at combating climate change.",
      "numSpeaker": 3,
      "speaker": [
        "Olivia Parker",
        "Andrew Moore",
        "Sarah Williams"
      ],
      "status": "Completed"
    },
    {
      "name": "Tech in Crisis Management",
      "date": "2024-11-25",
      "description": "Exploring the use of technology in disaster management and crisis response.",
      "numSpeaker": 2,
      "speaker": [
        "Dr. Alan Baker",
        "Laura Walker"
      ],
      "status": "In Progress"
    },
    {
      "name": "Future of IoT Technologies",
      "date": "2024-12-15",
      "description": "A conference on the future of Internet of Things (IoT) technologies and applications.",
      "numSpeaker": 3,
      "speaker": [
        "Jason Moore",
        "Emily Turner",
        "Dr. Amanda Smith"
      ],
      "status": "Upcoming"
    },
    {
      "name": "AI in Mental Health Innovations",
      "date": "2024-11-13",
      "description": "Discussing how AI can improve mental health care and services.",
      "numSpeaker": 2,
      "speaker": [
        "Michael Johnson",
        "Dr. Nancy Carter"
      ],
      "status": "In Progress"
    },
    {
      "name": "Ethical AI Development Forum",
      "date": "2024-12-13",
      "description": "A forum focused on the ethical considerations in AI development.",
      "numSpeaker": 4,
      "speaker": [
        "Dr. Robert King",
        "Sophia Martinez",
        "David Adams",
        "Helen White"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Tech for Sustainable Development",
      "date": "2024-10-27",
      "description": "A discussion on the role of technology in achieving sustainable development goals.",
      "numSpeaker": 3,
      "speaker": [
        "John Clark",
        "Dr. Olivia Reed",
        "Rachel Martin"
      ],
      "status": "Completed"
    },
    {
      "name": "AI in Drug Discovery",
      "date": "2024-11-08",
      "description": "A symposium on how AI is accelerating the process of drug discovery.",
      "numSpeaker": 1,
      "speaker": [
        "Dr. Emily Brown"
      ],
      "status": "In Progress"
    },
    {
      "name": "Blockchain in Healthcare",
      "date": "2024-11-16",
      "description": "A conference exploring the potential of blockchain in the healthcare industry.",
      "numSpeaker": 2,
      "speaker": [
        "Daniel White",
        "Dr. Laura Anderson"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Tech-Enabled Education Forum",
      "date": "2024-12-08",
      "description": "Exploring the role of technology in enhancing education systems.",
      "numSpeaker": 3,
      "speaker": [
        "Helen Brown",
        "Jason Foster",
        "Rachel Peterson"
      ],
      "status": "Upcoming"
    },
    {
      "name": "AI in Financial Services",
      "date": "2024-10-17",
      "description": "A workshop on how AI is transforming financial services and banking.",
      "numSpeaker": 2,
      "speaker": [
        "David Clark",
        "Dr. Anna Richards"
      ],
      "status": "Completed"
    },
    {
      "name": "Green Tech for Clean Energy",
      "date": "2024-12-12",
      "description": "Showcasing green technology innovations for cleaner energy solutions.",
      "numSpeaker": 2,
      "speaker": [
        "Andrew Lee",
        "Dr. Jennifer Moore"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Future of Tech in Retail",
      "date": "2024-11-20",
      "description": "A discussion on how technology is reshaping the retail industry.",
      "numSpeaker": 3,
      "speaker": [
        "Sarah Walker",
        "Dr. Steven Brooks",
        "Michael Lee"
      ],
      "status": "In Progress"
    },
    {
      "name": "AI in Precision Agriculture",
      "date": "2024-12-11",
      "description": "A conference on the use of AI in precision agriculture and smart farming.",
      "numSpeaker": 2,
      "speaker": [
        "James Robinson",
        "Dr. Mary Allen"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Tech for Renewable Energy",
      "date": "2024-11-26",
      "description": "Exploring how technology is accelerating the adoption of renewable energy.",
      "numSpeaker": 1,
      "speaker": [
        "Dr. Daniel Green"
      ],
      "status": "In Progress"
    },
    {
      "name": "AI and Robotics in Industry",
      "date": "2024-12-20",
      "description": "A discussion on how AI and robotics are transforming industrial processes.",
      "numSpeaker": 3,
      "speaker": [
        "David Reed",
        "Lisa Green",
        "Dr. Michael Parker"
      ],
      "status": "Upcoming"
    },
    {
      "name": "Tech for Digital Governance",
      "date": "2024-11-24",
      "description": "A forum on the role of technology in transforming digital governance.",
      "numSpeaker": 4,
      "speaker": [
        "Andrew Scott",
        "Laura Williams",
        "Dr. James Foster",
        "Emily Collins"
      ],
      "status": "In Progress"
    }
  ],
  "latestNews": [
    {
      "newsHeadline": "Green Technology Innovations Push Renewable Energy Forward",
      "newsNote": "Green tech startups are revolutionizing the renewable energy sector with innovations in solar, wind, and hydropower technologies.",
      "newsImg": "https://s3-alpha-sig.figma.com/img/3e49/7f40/62a7fbd85c8797c85255038d926c9f8a?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=WE96aEmm4J9CW9vNZKjmY2y3fnFAz5hdzVPXVk0CI7v2GazbSo12P-HOl-hQa3lj3LpdU3HvW6YRIRkuWiBLy3v4wTuZgSInvWMuhzfv61FPujKq64jZqrWS-TDnKJijLexV1Lol1tplzD~gemak1KyffaXzBIkguCr1AqG11JOiRiZDd9E-2Hb~jGm4I3EkLzavYYYHEHOd~W06fP4mLcGfp6cxn8BL1xCU5N7gZHexdsT~hVjh~Zw-rB-2lfAdVAEzRNep-YAMo8CeFzzGNbl1vJRmCPSRSepezKuX5AJ4YyV~vPKcBpGa9nYglMnUjj0yGlYkx9KhxkCBq2nNzQ__"
    },
    {
      "newsHeadline": "Quantum Computing Achieves Major Breakthrough in Cryptography",
      "newsNote": "A team of scientists has successfully demonstrated quantum computers' ability to solve complex cryptographic problems faster than traditional systems.",
      "newsImg": "https://s3-alpha-sig.figma.com/img/2c42/cc44/aeae4339db1a6549e1de209ac7d2a9d6?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=eViR0ga~IVowzfaToYKrZIqjypaw6KykBPfAiIuyZ9O2urKrOSMMkU4zjgTF7FVjVLz7p7K5M8VA9pyiEWCC29mVyAWCj73Kf5UCLWO4zVYnw24uAJ9yqzfr1HpjYELf6mWB7~~6qVpPfJnaJ~ZtWW0h4uRs1CWdG9VW6hrO10BHcJLueHp8Xn~UPXYWoIRcNBB3sqRNymZq2~q1gA11oie31D~aX2-zPN6X2xDkGxuBmSfk-yYxFA4x8r45FhPlwauu~dPiyjOWMJFu3rBV8skDide1L5-OoZcsgMVB5TvzMkKsFJZYqMurw~AsOKgl8wPgK4lmR9VHwAQAwMiPpw__"
    },
    {
      "newsHeadline": "AI Advances in Healthcare Transforming Patient Care",
      "newsNote": "Researchers have developed AI-driven diagnostic tools that significantly improve early detection of diseases, leading to better patient outcomes.",
      "newsImg": "https://s3-alpha-sig.figma.com/img/f267/c3a2/2a8ab70e1713b526c436e78c86ff9adc?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YR4jeQ6JxR6g9L8ZiA4NalgxzcenQu0472iE12GPilXSbN9Aj0ahg-fAQlLhiBtl5LtFHeYL8~lrpylWvb2USexUPKMrfWyBTwPaXPOAzHJZhCFM0z~u~ihO6mVSwrXUuJ1BQp4WFC1a-B22sZiIgNiSnMIpec5PJaB~r5gdMVR~pFX7~Sc2CLKULpT~DaTzHBkAY3lmkRfZsRdKXDIAjJsjFli9SrTOJzT0CfI9pKdb3fQGSM0Qzp5LwmaxxGz1ysQkhCVpCkoq-7KYUnyi1aNp3Jhf2wyPwoY08qtQ87PiisYx905heSYb5gk8tmfQaWd8jaFD3uCZEavZ~i8Rzg__"
    }
  ],
  "registration": [
    {
      "height": 700,
      "monthLg": "Jan",
      "monthSm": "Jn"
    },
    {
      "height": 820,
      "monthLg": "Feb",
      "monthSm": "Fb"
    },
    {
      "height": 450,
      "monthLg": "Mar",
      "monthSm": "Mr"
    },
    {
      "height": 980,
      "monthLg": "Apr",
      "monthSm": "Ap"
    },
    {
      "height": 600,
      "monthLg": "May",
      "monthSm": "My"
    },
    {
      "height": 750,
      "monthLg": "Jun",
      "monthSm": "Jn"
    },
    {
      "height": 470,
      "monthLg": "Jul",
      "monthSm": "Jl"
    },
    {
      "height": 900,
      "monthLg": "Aug",
      "monthSm": "Ag"
    },
    {
      "height": 500,
      "monthLg": "Sep",
      "monthSm": "Sp"
    },
    {
      "height": 920,
      "monthLg": "Oct",
      "monthSm": "Oc"
    },
    {
      "height": 370,
      "monthLg": "Nov",
      "monthSm": "Nv"
    },
    {
      "height": 1000,
      "monthLg": "Dec",
      "monthSm": "Dc"
    }
  ],
  "summary": [
    {
      "title": "Total Revenue",
      "rate": "100,000",
      "percentage": "+5.0%"
    },
    {
      "title": "Total Registrations",
      "rate": 25,
      "percentage": "-5.0%"
    },
    {
      "title": "Active Speakers",
      "rate": 300,
      "percentage": "+5.0%"
    },
    {
      "title": "Total Revenue",
      "rate": "$500,000",
      "percentage": "+5.0%"
    }
  ],
  "trash": [
    {
      "name": "Robotics in Manufacturing Forum",
      "date": "2024-10-22",
      "description": "The latest developments in robotics and automation in manufacturing.",
      "numSpeaker": 2,
      "speaker": [
        "Thomas Greene",
        "Maria Velez"
      ],
      "status": "Completed",
      "deletedAt": "2024-10-31T19:41:46.364Z"
    },
    {
      "name": "AI Ethics Conference",
      "date": "2024-11-08",
      "description": "Debating the ethical implications of artificial intelligence.",
      "numSpeaker": 4,
      "speaker": [
        "Dr. Robert Miller",
        "Alice Cooper",
        "Nina Paul",
        "Dr. Jonathan Wright"
      ],
      "status": "Completed",
      "deletedAt": "2024-10-31T20:52:11.788Z",
      "updatedAt": "2024-10-31T20:08:39.260Z"
    }
  ],
  "notifications": []
};

// Single CORS middleware configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// Data validation middleware
const validateEventData = (req, res, next) => {
    const { name, date, location, description } = req.body;
    
    if (!name || !date || !location || !description) {
        return res.status(400).json({
            error: 'Missing required fields',
            required: ['name', 'date', 'location', 'description']
        });
    }
    
    next();
};

// Routes
// Get all data
app.get('/', async (req, res) => {
    try {
        res.status(200).json(inMemoryDB);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve data',
            message: error.message
        });
    }
});

// Get latest events
app.get('/latest', async (req, res) => {
    try {
        res.status(200).json(inMemoryDB.latest);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve latest events',
            message: error.message
        });
    }
});

// Get all events
app.get('/event', async (req, res) => {
    try {
        res.status(200).json(inMemoryDB.event);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve events',
            message: error.message
        });
    }
});

// Create new event
app.post('/event', validateEventData, async (req, res) => {
    try {
        // Check for duplicate event names
        const existingEvent = inMemoryDB.event.find(
            e => e.name.toLowerCase() === req.body.name.toLowerCase()
        );

        if (existingEvent) {
            return res.status(400).json({
                error: 'An event with this name already exists'
            });
        }

        const newEvent = {
            id: uuidv4(),
            ...req.body,
            createdAt: new Date().toISOString()
        };

        inMemoryDB.event.unshift(newEvent);
        
        // Add notification for new event
        inMemoryDB.notifications.unshift({
            id: uuidv4(),
            message: `New event "${newEvent.name}" has been created`,
            timestamp: new Date().toISOString(),
            type: 'new_event'
        });

        // Maintain notifications limit
        if (inMemoryDB.notifications.length > 50) {
            inMemoryDB.notifications = inMemoryDB.notifications.slice(0, 50);
        }

        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to create event',
            message: error.message
        });
    }
});

// Delete notification
app.delete('/notifications/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const notificationIndex = inMemoryDB.notifications.findIndex(
            notification => notification.id === id
        );

        if (notificationIndex === -1) {
            return res.status(404).json({
                error: 'Notification not found'
            });
        }

        const deletedNotification = inMemoryDB.notifications.splice(notificationIndex, 1)[0];
        
        res.status(200).json({
            message: 'Notification deleted successfully',
            notification: deletedNotification
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to delete notification',
            message: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Cannot ${req.method} ${req.url}`
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
