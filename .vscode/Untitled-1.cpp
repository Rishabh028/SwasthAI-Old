#include <iostream>
#include <queue>
#include <vector>
using namespace std;


class Queue {
private:
    vector<int> arr;
    int frontIndex, rearIndex, size;

public:
    Queue() {
        frontIndex = 0;
        rearIndex = -1;
        size = 0;
    }

    void enqueue(int x) {
        arr.push_back(x);
        rearIndex++;
        size++;
    }

    int dequeue() {
        if (isEmpty()) {
            cout << "Queue is empty\n";
            return -1;
        }
        int data = arr[frontIndex];
        frontIndex++;
        size--;
        return data;
    }

    int front() {
        if (isEmpty()) return -1;
        return arr[frontIndex];
    }

    bool isEmpty() {
        return size == 0;
    }
};


Queue mergeKSortedQueues(vector<Queue>& queues) {
    
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> minHeap;
    Queue result;

   
    for (int i = 0; i < queues.size(); i++) {
        if (!queues[i].isEmpty()) {
            minHeap.push({queues[i].dequeue(), i});
        }
    }

    
    while (!minHeap.empty()) {
        int val=minHeap.top().first;
        int idx=minHeap.top().second;
        
        minHeap.pop();

        result.enqueue(val); 

        
        if (!queues[idx].isEmpty()) {
            minHeap.push({queues[idx].dequeue(), idx});
        }
    }

    return result;
}

int main() {
    int k = 3; 

    vector<Queue> queues(k);
    int arr1[] = {1, 4, 7};
    int arr2[] = {2, 5, 8};
    int arr3[] = {3, 6, 9};

    for (int x : arr1) queues[0].enqueue(x);
    for (int x : arr2) queues[1].enqueue(x);
    for (int x : arr3) queues[2].enqueue(x);

    Queue mergedQueue = mergeKSortedQueues(queues);

    cout << "Merged Sorted Queue: ";
    while (!mergedQueue.isEmpty()) {
        cout << mergedQueue.dequeue() << " ";
    }
    cout << endl;

    return 0;
}