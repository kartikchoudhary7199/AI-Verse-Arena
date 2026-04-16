// Mock data used for demonstration — replace with real API responses
export const MOCK_CHATS = [
  { id: 'c1', title: 'Sorting Algorithm Trade-offs', timestamp: '2h ago', active: true },
  { id: 'c2', title: 'React vs Vue Performance', timestamp: '5h ago', active: false },
  { id: 'c3', title: 'SQL Query Optimization', timestamp: 'Yesterday', active: false },
  { id: 'c4', title: 'REST vs GraphQL APIs', timestamp: 'Yesterday', active: false },
  { id: 'c5', title: 'Docker vs Kubernetes', timestamp: '2 days ago', active: false },
];

export const DEMO_RESPONSE = {
  problem:
    'What is the best sorting algorithm for a nearly-sorted large dataset, and how does it compare in real-world performance?',
  solution_1: `## Timsort — The Adaptive Hybrid

Timsort is a **hybrid sorting algorithm** derived from merge sort and insertion sort. It is the default sort in Python and Java.

### Key Characteristics
- **Time Complexity**: O(n log n) worst case, O(n) best case (already sorted)
- **Space Complexity**: O(n)
- **Stable**: Yes

### Why It Excels on Nearly-Sorted Data
Timsort detects natural **runs** (already sorted subsequences) and exploits them, requiring far fewer comparisons.

\`\`\`python
import timsort

data = [1, 2, 3, 5, 4, 6, 7, 8]
sorted_data = sorted(data)  # Uses Timsort internally
\`\`\`

### Real-World Performance
| Dataset Size | Nearly Sorted | Random |
|---|---|---|
| 10,000 | ~0.3ms | ~1.2ms |
| 100,000 | ~2.1ms | ~14ms |

Timsort consistently outperforms in nearly-sorted scenarios by orders of magnitude.`,

  solution_2: `## Insertion Sort — Simplicity Wins Small Batches

For **small or nearly-sorted** datasets, insertion sort's simplicity gives it surprising competitiveness due to low overhead.

### Key Characteristics
- **Time Complexity**: O(n²) worst, O(n) best
- **Space Complexity**: O(1) — in-place
- **Stable**: Yes

### Why Consider It?
When data is **already 90%+ sorted**, insertion sort's inner loop rarely executes, making it extremely fast in practice.

\`\`\`python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr
\`\`\`

### Limitations
- Degrades dramatically on **large random** datasets (O(n²))
- Not ideal for datasets over ~10,000 elements unless nearly sorted`,

  judge: {
    solution_1_score: 9,
    solution_2_score: 6,
    solution_1_reasoning:
      'Timsort is a production-grade algorithm with provably optimal performance for nearly-sorted data at any scale. Its use in Python and Java stdlib demonstrates real-world trust. The explanation is comprehensive, with benchmarks and complexity analysis.',
    solution_2_reasoning:
      'Insertion sort is a valid choice for very small or highly sorted data, but it does not scale to "large datasets" specified in the problem. The answer is partially correct but incomplete in addressing the full scope of the question.',
  },
};
