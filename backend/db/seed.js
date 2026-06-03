const pool = require('../config/db')

const problems = [
    {
        title: 'Two Sum',
        description: `Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Return the answer in any order.`,
        difficulty: 'easy',
        topic: 'arrays',
        examples: JSON.stringify([
            {
                input: 'nums = [2,7,11,15], target = 9',
                output: '[0,1]',
                explanation: 'nums[0] + nums[1] = 2 + 7 = 9'
            },
            {
                input: 'nums = [3,2,4], target = 6',
                output: '[1,2]',
                explanation: 'nums[1] + nums[2] = 2 + 4 = 6'
            }
        ]),
        test_cases: JSON.stringify([
            { input: '[2,7,11,15]\n9', expected_output: '[0,1]' },
            { input: '[3,2,4]\n6', expected_output: '[1,2]' },
            { input: '[3,3]\n6', expected_output: '[0,1]' }
        ])
    },
    {
        title: 'Valid Parentheses',
        description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.
- Every close bracket has a corresponding open bracket of the same type.`,
        difficulty: 'easy',
        topic: 'stacks',
        examples: JSON.stringify([
            {
                input: 's = "()"',
                output: 'true',
                explanation: 'opening and closing brackets match'
            },
            {
                input: 's = "()[]{}"',
                output: 'true',
                explanation: 'all brackets match in correct order'
            },
            {
                input: 's = "(]"',
                output: 'false',
                explanation: 'brackets do not match'
            }
        ]),
        test_cases: JSON.stringify([
            { input: '()', expected_output: 'true' },
            { input: '()[]{} ', expected_output: 'true' },
            { input: '(]', expected_output: 'false' },
            { input: '([)]', expected_output: 'false' }
        ])
    },
    {
        title: 'Reverse Linked List',
        description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
        difficulty: 'easy',
        topic: 'linked lists',
        examples: JSON.stringify([
            {
                input: 'head = [1,2,3,4,5]',
                output: '[5,4,3,2,1]',
                explanation: 'list is reversed'
            },
            {
                input: 'head = [1,2]',
                output: '[2,1]',
                explanation: 'list is reversed'
            }
        ]),
        test_cases: JSON.stringify([
            { input: '[1,2,3,4,5]', expected_output: '[5,4,3,2,1]' },
            { input: '[1,2]', expected_output: '[2,1]' },
            { input: '[1]', expected_output: '[1]' }
        ])
    },
    {
        title: 'Best Time to Buy and Sell Stock',
        description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
        difficulty: 'easy',
        topic: 'arrays',
        examples: JSON.stringify([
            {
                input: 'prices = [7,1,5,3,6,4]',
                output: '5',
                explanation: 'buy on day 2 (price=1) and sell on day 5 (price=6), profit = 6-1 = 5'
            },
            {
                input: 'prices = [7,6,4,3,1]',
                output: '0',
                explanation: 'no profit possible, return 0'
            }
        ]),
        test_cases: JSON.stringify([
            { input: '[7,1,5,3,6,4]', expected_output: '5' },
            { input: '[7,6,4,3,1]', expected_output: '0' },
            { input: '[1,2]', expected_output: '1' }
        ])
    },
    {
        title: 'Maximum Subarray',
        description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
        difficulty: 'medium',
        topic: 'dynamic programming',
        examples: JSON.stringify([
            {
                input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
                output: '6',
                explanation: 'subarray [4,-1,2,1] has the largest sum = 6'
            },
            {
                input: 'nums = [1]',
                output: '1',
                explanation: 'only one element'
            }
        ]),
        test_cases: JSON.stringify([
            { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected_output: '6' },
            { input: '[1]', expected_output: '1' },
            { input: '[5,4,-1,7,8]', expected_output: '23' }
        ])
    },
    {
        title: 'Climbing Stairs',
        description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
        difficulty: 'easy',
        topic: 'dynamic programming',
        examples: JSON.stringify([
            {
                input: 'n = 2',
                output: '2',
                explanation: '1+1 or 2, two ways to climb'
            },
            {
                input: 'n = 3',
                output: '3',
                explanation: '1+1+1, 1+2, 2+1, three ways to climb'
            }
        ]),
        test_cases: JSON.stringify([
            { input: '2', expected_output: '2' },
            { input: '3', expected_output: '3' },
            { input: '5', expected_output: '8' }
        ])
    },
    {
        title: 'Binary Search',
        description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.`,
        difficulty: 'easy',
        topic: 'binary search',
        examples: JSON.stringify([
            {
                input: 'nums = [-1,0,3,5,9,12], target = 9',
                output: '4',
                explanation: '9 exists in nums and its index is 4'
            },
            {
                input: 'nums = [-1,0,3,5,9,12], target = 2',
                output: '-1',
                explanation: '2 does not exist in nums so return -1'
            }
        ]),
        test_cases: JSON.stringify([
            { input: '[-1,0,3,5,9,12]\n9', expected_output: '4' },
            { input: '[-1,0,3,5,9,12]\n2', expected_output: '-1' }
        ])
    },
    {
        title: 'Merge Two Sorted Lists',
        description: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.`,
        difficulty: 'easy',
        topic: 'linked lists',
        examples: JSON.stringify([
            {
                input: 'list1 = [1,2,4], list2 = [1,3,4]',
                output: '[1,1,2,3,4,4]',
                explanation: 'both lists merged in sorted order'
            },
            {
                input: 'list1 = [], list2 = []',
                output: '[]',
                explanation: 'both lists are empty'
            }
        ]),
        test_cases: JSON.stringify([
            { input: '[1,2,4]\n[1,3,4]', expected_output: '[1,1,2,3,4,4]' },
            { input: '[]\n[]', expected_output: '[]' },
            { input: '[]\n[0]', expected_output: '[0]' }
        ])
    }
]


// this function inserts all problems into the database
async function seedProblems() {
    try {
        console.log('seeding problems...')

        for (let i = 0; i < problems.length; i++) {
            const p = problems[i]

            await pool.query(
                `INSERT INTO problems (title, description, difficulty, topic, examples, test_cases)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [p.title, p.description, p.difficulty, p.topic, p.examples, p.test_cases]
            )

            console.log('inserted:', p.title)
        }

        console.log('all problems seeded successfully')
        process.exit(0)

    } catch (err) {
        console.log('seeding failed:', err.message)
        process.exit(1)
    }
}

seedProblems()