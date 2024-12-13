export const getPaginationItems = (totalPages: number, selectedPage: number, maxLength: number) => {
    const res = []

    // handle totalPages less than or equal to maxLength
    if (totalPages <= maxLength) {
        for (let i = 1; i <= totalPages; i++) {
          res.push(i);
        }
      }
      // handle ellipsis logics
      else {
        const firstPage = 1;
        const confirmedPagesCount = 3;
        const deductedMaxLength = maxLength - confirmedPagesCount;
        const sideLength = deductedMaxLength / 2;

    // handle ellipsis in the middle
    if (selectedPage - firstPage < sideLength || totalPages - selectedPage < sideLength) {
        for (let j = 1; j <= sideLength + firstPage; j++) {
            res.push(j);
          }
          res.push('...');
          for (let k = totalPages - sideLength; k <= totalPages; k++) {
            res.push(k);
          }
    }
    // handle two ellipsis
    else if (
        selectedPage - firstPage >= deductedMaxLength &&
        totalPages - selectedPage >= deductedMaxLength
      ) {
        const deductedSideLength = sideLength - 1;
        res.push(1);
      res.push('...');

      for (
        let l = selectedPage - deductedSideLength;
        l <= selectedPage + deductedSideLength;
        l++
      ) {
        res.push(l);
      }

      res.push('...');
      res.push(totalPages);
    }
    // handle ellipsis not in the middle
    else {
        const isNearFirstPage = selectedPage - firstPage < totalPages - selectedPage;
        let remainingLength = maxLength;
        
  
        if (isNearFirstPage) {
          for (let m = 1; m <= selectedPage + 1; m++) {
            res.push(m);
            remainingLength -= 1;
          }
  
          res.push('...');
          remainingLength -= 1;

          for (let n = totalPages - (remainingLength - 1); n <= totalPages; n++) {
            res.push(n);
          }
        } else {
          for (let o = totalPages; o >= selectedPage - 1; o--) {
            res.unshift(o);
            remainingLength -= 1;
          }
  
          res.unshift('...');
          remainingLength -= 1;

          for (let p = remainingLength; p >= 1; p--) {
            res.unshift(p);
          }
        }
      }
  }

    return res
}       