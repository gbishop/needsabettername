import { $, show } from "./algovis";

function insertionSort(A) {
  let i, j, c;                    $({ i, j, c, A, line: 2 });
  for (i = 1; i < A.length; i++) {
    c = A[i];
    j = i - 1;                    $({ i, j, c, A, line: 5 });
    while (j > -1 && c < A[j]) {
      A[j + 1] = A[j];
      j--;                        $({ i, j, c, A, line: 8 });
    }
    A[j + 1] = c;                 $({ i, j, c, A, line: 10 });
  }                               $({ i, j, c, A, line: 11 });
}
insertionSort(["this", "is", "a", "test"]);
insertionSort([1, 5, 2, 4]);

show(1, insertionSort.toString());
