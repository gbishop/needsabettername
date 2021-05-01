import { $, show } from "./algovis";

function insertionSort(A) {
  let i, j, c;
  for (i = 1; i < A.length; i++) {
    c = A[i];
    j = i - 1;                    $({ i, j, c, A, line: 5 });
    while (j > -1 && c < A[j]) {
      A[j + 1] = A[j];
      j--;                        $({ i, j, c, A, line: 8 });
    }
    A[j + 1] = c;                 $({ i, j, c, A, line: 10 });
  }
}
insertionSort(["this", "is", "a", "test"]);

console.log(insertionSort.toString());

show(1, insertionSort.toString());
