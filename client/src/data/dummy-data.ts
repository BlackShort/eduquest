import type { Assignment, Coding, Mcq, Question, User } from "@/types/types";

// ========== USER DUMMY DATA ==========
export const dummyUsers: User[] = [
    {
        _id: "usr_001",
        username: "john_doe",
        email: "john.doe@example.com",
        role: "user",
        isVerified: true,
        isActive: true,
        createdAt: "2024-01-15T08:30:00.000Z",
        updatedAt: "2024-01-15T08:30:00.000Z"
    },
    {
        _id: "usr_002",
        username: "jane_smith",
        email: "jane.smith@example.com",
        role: "user",
        isVerified: true,
        isActive: true,
        createdAt: "2024-01-16T10:45:00.000Z",
        updatedAt: "2024-01-16T10:45:00.000Z"
    },
    {
        _id: "usr_003",
        username: "admin_user",
        email: "admin@eduquest.com",
        role: "admin",
        isVerified: true,
        isActive: true,
        createdAt: "2024-01-10T09:00:00.000Z",
        updatedAt: "2024-01-10T09:00:00.000Z"
    }
];

// ========== ASSIGNMENT DUMMY DATA ==========
export const dummyAssignments: Assignment[] = [
    {
        _id: "asgn_001",
        test_id: "test_asgn_001",
        subject_id: "sub_cs101",
        num_questions: 3,
        questions: [
            {
                question_id: "q_asgn_001",
                question_text: "Explain the difference between stack and heap memory allocation in programming languages."
            },
            {
                question_id: "q_asgn_002",
                question_text: "What are the SOLID principles in object-oriented programming? Describe each principle with examples."
            },
            {
                question_id: "q_asgn_003",
                question_text: "Discuss the time and space complexity of common sorting algorithms (Bubble Sort, Merge Sort, Quick Sort)."
            }
        ],
        createdAt: "2024-02-01T10:00:00.000Z",
        updatedAt: "2024-02-01T10:00:00.000Z"
    },
    {
        _id: "asgn_002",
        test_id: "test_asgn_002",
        subject_id: "sub_cs102",
        num_questions: 2,
        questions: [
            {
                question_id: "q_asgn_004",
                question_text: "Explain the concept of normalization in database design. What are the different normal forms?"
            },
            {
                question_id: "q_asgn_005",
                question_text: "Compare and contrast SQL and NoSQL databases. When would you choose one over the other?"
            }
        ],
        createdAt: "2024-02-05T14:30:00.000Z",
        updatedAt: "2024-02-05T14:30:00.000Z"
    },
    {
        _id: "asgn_003",
        test_id: "test_asgn_003",
        subject_id: "sub_cs103",
        num_questions: 4,
        questions: [
            {
                question_id: "q_asgn_006",
                question_text: "What is polymorphism in object-oriented programming? Provide examples."
            },
            {
                question_id: "q_asgn_007",
                question_text: "Explain the concept of inheritance and its types in OOP."
            },
            {
                question_id: "q_asgn_008",
                question_text: "Describe the differences between abstract classes and interfaces."
            },
            {
                question_id: "q_asgn_009",
                question_text: "What are design patterns? Explain the Singleton pattern with an example."
            }
        ],
        createdAt: "2024-02-10T15:00:00.000Z",
        updatedAt: "2024-02-10T15:00:00.000Z"
    },
    {
        _id: "asgn_004",
        test_id: "test_asgn_004",
        subject_id: "sub_cs104",
        num_questions: 2,
        questions: [
            {
                question_id: "q_asgn_010",
                question_text: "What is the difference between synchronous and asynchronous programming? Provide examples of each."
            },
            {
                question_id: "q_asgn_011",
                question_text: "Explain the concept of event-driven programming and its advantages."
            }
        ],
        createdAt: "2024-02-12T11:30:00.000Z",
        updatedAt: "2024-02-12T11:30:00.000Z"
    }
];

// ========== CODING DUMMY DATA ==========
export const dummyCoding: Coding[] = [
    {
        _id: "code_001",
        test_id: "test_code_001",
        subject_id: "sub_cs101",
        num_questions: 3,
        questions: [
            {
                question_id: "q_code_001",
                question_text: "Write a function to find the factorial of a number using recursion.",
                test_cases: [
                    { input: "5", output: "120" },
                    { input: "0", output: "1" },
                    { input: "3", output: "6" },
                    { input: "7", output: "5040" }
                ]
            },
            {
                question_id: "q_code_002",
                question_text: "Implement a function to check if a given string is a palindrome.",
                test_cases: [
                    { input: "racecar", output: "true" },
                    { input: "hello", output: "false" },
                    { input: "madam", output: "true" },
                    { input: "A man a plan a canal Panama", output: "true" }
                ]
            },
            {
                question_id: "q_code_003",
                question_text: "Write a function to reverse a linked list.",
                test_cases: [
                    { input: "1->2->3->4->5", output: "5->4->3->2->1" },
                    { input: "1->2", output: "2->1" },
                    { input: "1", output: "1" }
                ]
            }
        ],
        createdAt: "2024-02-10T11:00:00.000Z",
        updatedAt: "2024-02-10T11:00:00.000Z"
    },
    {
        _id: "code_002",
        test_id: "test_code_002",
        subject_id: "sub_cs103",
        num_questions: 2,
        questions: [
            {
                question_id: "q_code_004",
                question_text: "Implement binary search algorithm to find an element in a sorted array.",
                test_cases: [
                    { input: "[1,2,3,4,5,6,7,8,9], 5", output: "4" },
                    { input: "[1,3,5,7,9], 3", output: "1" },
                    { input: "[2,4,6,8], 7", output: "-1" }
                ]
            },
            {
                question_id: "q_code_005",
                question_text: "Write a function to find the longest common subsequence of two strings.",
                test_cases: [
                    { input: "ABCDGH, AEDFHR", output: "ADH" },
                    { input: "AGGTAB, GXTXAYB", output: "GTAB" },
                    { input: "ABC, DEF", output: "" }
                ]
            }
        ],
        createdAt: "2024-02-12T09:30:00.000Z",
        updatedAt: "2024-02-12T09:30:00.000Z"
    }
];

// ========== MCQ DUMMY DATA ==========
export const dummyMcqs: Mcq[] = [
    {
        _id: "mcq_001",
        test_id: "test_mcq_001",
        subject_id: "sub_cs101",
        num_questions: 5,
        questions: [
            {
                question_id: "q_mcq_001",
                question_text: "What is the time complexity of binary search?",
                options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
                correct_answer: "O(log n)"
            },
            {
                question_id: "q_mcq_002",
                question_text: "Which data structure uses LIFO (Last In First Out)?",
                options: ["Queue", "Stack", "Array", "Tree"],
                correct_answer: "Stack"
            },
            {
                question_id: "q_mcq_003",
                question_text: "What does OOP stand for?",
                options: [
                    "Object-Oriented Programming",
                    "Only One Protocol",
                    "Open Operating Platform",
                    "Object Operation Process"
                ],
                correct_answer: "Object-Oriented Programming"
            },
            {
                question_id: "q_mcq_004",
                question_text: "Which sorting algorithm has the best average-case time complexity?",
                options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
                correct_answer: "Merge Sort"
            },
            {
                question_id: "q_mcq_005",
                question_text: "What is polymorphism in OOP?",
                options: [
                    "Creating multiple objects",
                    "Ability of objects to take multiple forms",
                    "Using multiple inheritance",
                    "Declaring multiple variables"
                ],
                correct_answer: "Ability of objects to take multiple forms"
            }
        ],
        createdAt: "2024-02-08T13:00:00.000Z",
        updatedAt: "2024-02-08T13:00:00.000Z"
    },
    {
        _id: "mcq_002",
        test_id: "test_mcq_002",
        subject_id: "sub_cs102",
        num_questions: 4,
        questions: [
            {
                question_id: "q_mcq_006",
                question_text: "What does SQL stand for?",
                options: [
                    "Structured Query Language",
                    "Simple Question Language",
                    "Standard Queue Logic",
                    "System Query List"
                ],
                correct_answer: "Structured Query Language"
            },
            {
                question_id: "q_mcq_007",
                question_text: "Which of the following is a NoSQL database?",
                options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
                correct_answer: "MongoDB"
            },
            {
                question_id: "q_mcq_008",
                question_text: "What is the primary key in a database table?",
                options: [
                    "A foreign reference",
                    "A unique identifier for each record",
                    "The first column in a table",
                    "An optional field"
                ],
                correct_answer: "A unique identifier for each record"
            },
            {
                question_id: "q_mcq_009",
                question_text: "What does ACID stand for in database transactions?",
                options: [
                    "Atomicity, Consistency, Isolation, Durability",
                    "Action, Control, Input, Data",
                    "Access, Create, Insert, Delete",
                    "Applied, Compiled, Indexed, Designed"
                ],
                correct_answer: "Atomicity, Consistency, Isolation, Durability"
            }
        ],
        createdAt: "2024-02-11T15:45:00.000Z",
        updatedAt: "2024-02-11T15:45:00.000Z"
    },
    {
        _id: "mcq_003",
        test_id: "test_mcq_003",
        subject_id: "sub_cs103",
        num_questions: 3,
        questions: [
            {
                question_id: "q_mcq_010",
                question_text: "Which protocol is used for secure communication over the internet?",
                options: ["HTTP", "HTTPS", "FTP", "SMTP"],
                correct_answer: "HTTPS"
            },
            {
                question_id: "q_mcq_011",
                question_text: "What is the purpose of DNS?",
                options: [
                    "To encrypt data",
                    "To translate domain names to IP addresses",
                    "To compress files",
                    "To manage databases"
                ],
                correct_answer: "To translate domain names to IP addresses"
            },
            {
                question_id: "q_mcq_012",
                question_text: "Which HTTP method is used to retrieve data?",
                options: ["POST", "PUT", "GET", "DELETE"],
                correct_answer: "GET"
            }
        ],
        createdAt: "2024-02-13T10:20:00.000Z",
        updatedAt: "2024-02-13T10:20:00.000Z"
    }
];

export const dummyQuestions: Question[] = [
    {
        question_id: "q_code_001",
        number: 1,
        question_text: "Write a function to find the factorial of a number using recursion.",
        difficulty: "easy",
        acceptance: "65%",
        isPremium: false,
        category: "recursion"
    },
    {
        question_id: "q_code_002",
        number: 2,
        question_text: "Write a function to check if a given string is a palindrome.",
        difficulty: "easy",
        acceptance: "70%",
        isPremium: false,
        category: "string"
    },
    {
        question_id: "q_code_003",
        number: 3,
        question_text: "Implement a function to reverse an array without using built-in methods.",
        difficulty: "easy",
        acceptance: "75%",
        isPremium: false,
        category: "array"
    },
    {
        question_id: "q_code_004",
        number: 4,
        question_text: "Write a function to find the maximum element in an array.",
        difficulty: "easy",
        acceptance: "80%",
        isPremium: false,
        category: "array"
    },
    {
        question_id: "q_code_005",
        number: 5,
        question_text: "Implement binary search algorithm.",
        difficulty: "medium",
        acceptance: "60%",
        isPremium: false,
        category: "search"
    },
    {
        question_id: "q_code_006",
        number: 6,
        question_text: "Write a function to count vowels in a string.",
        difficulty: "easy",
        acceptance: "75%",
        isPremium: false,
        category: "string"
    },
    {
        question_id: "q_code_007",
        number: 7,
        question_text: "Implement a function to remove duplicates from an array.",
        difficulty: "medium",
        acceptance: "65%",
        isPremium: false,
        category: "array"
    },
    {
        question_id: "q_code_008",
        number: 8,
        question_text: "Write a function to find the sum of digits in a number.",
        difficulty: "easy",
        acceptance: "70%",
        isPremium: false,
        category: "math"
    },
    {
        question_id: "q_code_009",
        number: 9,
        question_text: "Implement a function to check if a number is prime.",
        difficulty: "easy",
        acceptance: "68%",
        isPremium: false,
        category: "math"
    },
    {
        question_id: "q_code_010",
        number: 10,
        question_text: "Write a function to convert temperature from Celsius to Fahrenheit.",
        difficulty: "easy",
        acceptance: "82%",
        isPremium: false,
        category: "math"
    },
    {
        question_id: "q_code_011",
        number: 11,
        question_text: "Implement a function to merge two sorted arrays.",
        difficulty: "medium",
        acceptance: "62%",
        isPremium: false,
        category: "array"
    },
    {
        question_id: "q_code_012",
        number: 12,
        question_text: "Write a function to find the second largest element in an array.",
        difficulty: "medium",
        acceptance: "58%",
        isPremium: false,
        category: "array"
    },
    {
        question_id: "q_code_013",
        number: 13,
        question_text: "Implement a function to rotate an array by k positions.",
        difficulty: "medium",
        acceptance: "55%",
        isPremium: false,
        category: "array"
    },
    {
        question_id: "q_code_014",
        number: 14,
        question_text: "Write a function to find all pairs that sum to a target value.",
        difficulty: "medium",
        acceptance: "60%",
        isPremium: false,
        category: "array"
    },
    {
        question_id: "q_code_015",
        number: 15,
        question_text: "Implement a function to check if a string is an anagram.",
        difficulty: "easy",
        acceptance: "72%",
        isPremium: false,
        category: "string"
    },
    {
        question_id: "q_code_016",
        number: 16,
        question_text: "Write a function to find the longest substring without repeating characters.",
        difficulty: "medium",
        acceptance: "52%",
        isPremium: false,
        category: "string"
    },
    {
        question_id: "q_code_017",
        number: 17,
        question_text: "Implement bubble sort algorithm.",
        difficulty: "easy",
        acceptance: "68%",
        isPremium: false,
        category: "sort"
    },
    {
        question_id: "q_code_018",
        number: 18,
        question_text: "Write a function to find the GCD of two numbers.",
        difficulty: "easy",
        acceptance: "70%",
        isPremium: false,
        category: "math"
    },
    {
        question_id: "q_code_019",
        number: 19,
        question_text: "Implement a function to check if brackets are balanced.",
        difficulty: "medium",
        acceptance: "61%",
        isPremium: false,
        category: "stack"
    },
    {
        question_id: "q_code_020",
        number: 20,
        question_text: "Write a function to flatten a nested array.",
        difficulty: "medium",
        acceptance: "64%",
        isPremium: false,
        category: "array"
    },
    {
        question_id: "q_code_021",
        number: 21,
        question_text: "Implement quick sort algorithm.",
        difficulty: "hard",
        acceptance: "45%",
        isPremium: true,
        category: "sort"
    },
    {
        question_id: "q_code_022",
        number: 22,
        question_text: "Write a function to find the intersection of two arrays.",
        difficulty: "medium",
        acceptance: "58%",
        isPremium: false,
        category: "array"
    },
    {
        question_id: "q_code_023",
        number: 23,
        question_text: "Implement a function to transpose a matrix.",
        difficulty: "medium",
        acceptance: "66%",
        isPremium: false,
        category: "matrix"
    },
    {
        question_id: "q_code_024",
        number: 24,
        question_text: "Write a function to find the Fibonacci number at position n.",
        difficulty: "easy",
        acceptance: "73%",
        isPremium: false,
        category: "recursion"
    },
    {
        question_id: "q_code_025",
        number: 25,
        question_text: "Implement a function to check if a number is a perfect square.",
        difficulty: "easy",
        acceptance: "76%",
        isPremium: false,
        category: "math"
    },
    {
        question_id: "q_code_026",
        number: 26,
        question_text: "Write a function to capitalize the first letter of each word.",
        difficulty: "easy",
        acceptance: "78%",
        isPremium: false,
        category: "string"
    },
    {
        question_id: "q_code_027",
        number: 27,
        question_text: "Implement a function to find the mode of an array.",
        difficulty: "medium",
        acceptance: "59%",
        isPremium: false,
        category: "array"
    },
    {
        question_id: "q_code_028",
        number: 28,
        question_text: "Write a function to check if a number is an Armstrong number.",
        difficulty: "easy",
        acceptance: "67%",
        isPremium: false,
        category: "math"
    },
    {
        question_id: "q_code_029",
        number: 29,
        question_text: "Implement a function to generate all permutations of a string.",
        difficulty: "hard",
        acceptance: "40%",
        isPremium: true,
        category: "backtracking"
    },
    {
        question_id: "q_code_030",
        number: 30,
        question_text: "Write a function to find the median of an array.",
        difficulty: "medium",
        acceptance: "54%",
        isPremium: false,
        category: "array"
    },
    {
        question_id: "q_code_031",
        number: 31,
        question_text: "Implement insertion sort algorithm.",
        difficulty: "easy",
        acceptance: "71%",
        isPremium: false,
        category: "sort"
    },
    {
        question_id: "q_code_032",
        number: 32,
        question_text: "Write a function to find the longest common substring.",
        difficulty: "hard",
        acceptance: "38%",
        isPremium: true,
        category: "dp"
    },
    {
        question_id: "q_code_033",
        number: 33,
        question_text: "Implement a function to check if a string contains all unique characters.",
        difficulty: "easy",
        acceptance: "74%",
        isPremium: false,
        category: "string"
    },
    {
        question_id: "q_code_034",
        number: 34,
        question_text: "Write a function to generate Pascal's triangle.",
        difficulty: "medium",
        acceptance: "63%",
        isPremium: false,
        category: "array"
    },
    {
        question_id: "q_code_035",
        number: 35,
        question_text: "Implement a function to find all subsets of a set.",
        difficulty: "hard",
        acceptance: "42%",
        isPremium: true,
        category: "backtracking"
    },
    {
        question_id: "q_code_036",
        number: 36,
        question_text: "Write a function to convert a number to binary.",
        difficulty: "easy",
        acceptance: "77%",
        isPremium: false,
        category: "math"
    },
    {
        question_id: "q_code_037",
        number: 37,
        question_text: "Implement a function to find the power set of a string.",
        difficulty: "hard",
        acceptance: "41%",
        isPremium: true,
        category: "backtracking"
    },
    {
        question_id: "q_code_038",
        number: 38,
        question_text: "Write a function to check if a linked list is circular.",
        difficulty: "medium",
        acceptance: "50%",
        isPremium: true,
        category: "linkedlist"
    },
    {
        question_id: "q_code_039",
        number: 39,
        question_text: "Implement a function to find the kth element from the end of a linked list.",
        difficulty: "medium",
        acceptance: "55%",
        isPremium: true,
        category: "linkedlist"
    },
    {
        question_id: "q_code_040",
        number: 40,
        question_text: "Write a function to detect a cycle in a linked list.",
        difficulty: "medium",
        acceptance: "52%",
        isPremium: true,
        category: "linkedlist"
    },
    {
        question_id: "q_code_041",
        number: 41,
        question_text: "Implement a function to find the LCM of two numbers.",
        difficulty: "easy",
        acceptance: "69%",
        isPremium: false,
        category: "math"
    },
    {
        question_id: "q_code_042",
        number: 42,
        question_text: "Write a function to implement atoi (convert string to integer).",
        difficulty: "medium",
        acceptance: "57%",
        isPremium: true,
        category: "string"
    },
    {
        question_id: "q_code_043",
        number: 43,
        question_text: "Implement a function to find the sum of a matrix diagonal.",
        difficulty: "easy",
        acceptance: "72%",
        isPremium: false,
        category: "matrix"
    },
    {
        question_id: "q_code_044",
        number: 44,
        question_text: "Write a function to check if a matrix is symmetric.",
        difficulty: "medium",
        acceptance: "60%",
        isPremium: false,
        category: "matrix"
    },
    {
        question_id: "q_code_045",
        number: 45,
        question_text: "Implement merge sort algorithm.",
        difficulty: "hard",
        acceptance: "48%",
        isPremium: true,
        category: "sort"
    },
    {
        question_id: "q_code_046",
        number: 46,
        question_text: "Write a function to find the minimum window substring.",
        difficulty: "hard",
        acceptance: "35%",
        isPremium: true,
        category: "string"
    },
    {
        question_id: "q_code_047",
        number: 47,
        question_text: "Implement a function to validate an email address.",
        difficulty: "easy",
        acceptance: "71%",
        isPremium: false,
        category: "regex"
    },
    {
        question_id: "q_code_048",
        number: 48,
        question_text: "Write a function to find the number of islands in a grid.",
        difficulty: "hard",
        acceptance: "44%",
        isPremium: true,
        category: "graph"
    },
    {
        question_id: "q_code_049",
        number: 49,
        question_text: "Implement a function to solve the knapsack problem.",
        difficulty: "hard",
        acceptance: "37%",
        isPremium: true,
        category: "dp"
    },
    {
        question_id: "q_code_050",
        number: 50,
        question_text: "Write a function to find the edit distance between two strings.",
        difficulty: "hard",
        acceptance: "39%",
        isPremium: true,
        category: "dp"
    }
];

// ========== EXPORT ALL DUMMY DATA ==========
export const dummyData = {
    users: dummyUsers,
    assignments: dummyAssignments,
    coding: dummyCoding,
    mcqs: dummyMcqs,
    dummyQuestions,
};
