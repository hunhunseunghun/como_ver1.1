// import { useMemo } from 'react';
// import styled from 'styled-components';

// interface PaginationProps {
//   activePage: number;
//   totalPages: number;
//   range: number;
//   onChange: (page: number) => void;
// }

// const Pagination = ({ activePage, totalPages, range, onChange }: PaginationProps) => {
//   const pageItems = useMemo(
//     () =>
//       Array.from(
//         { length: Math.min(range, totalPages - (Math.ceil(activePage / range) - 1) * range) },
//         (_, i) => (Math.ceil(activePage / range) - 1) * range + i + 1,
//       ),
//     [activePage, range, totalPages],
//   );

//   const isPrevButtonExist = activePage > range;
//   const isNextButtonExist = totalPages > Math.ceil(activePage / range) * range;

//   // 이전 범위의 마지막 페이지로 이동
//   const goToPrevRangeLastPage = () => {
//     onChange((Math.ceil(activePage / range) - 1) * range);
//   };

//   // 이후 범위의 첫 페이지로 이동
//   const goToNextRangeFirstPage = () => {
//     onChange(Math.ceil(activePage / range) * range + 1);
//   };

//   return (
//     <Container>
//       <Button onClick={goToPrevRangeLastPage} disabled={!isPrevButtonExist}>
//         이전
//       </Button>
//       {pageItems.map((page) => {
//         const currentPage = activePage === page;
//         return (
//           <PaginationItem key={page} isSelected={currentPage} onClick={() => onChange(page)}>
//             {page}
//           </PaginationItem>
//         );
//       })}
//       <Button onClick={goToNextRangeFirstPage} disabled={!isNextButtonExist}>
//         다음
//       </Button>
//     </Container>
//   );