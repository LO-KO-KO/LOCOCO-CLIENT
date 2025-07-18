'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CategoryBar, TopUtil } from './header-content';
import { useHeaderAction } from './use-header-action';

interface HeaderProps {
  authStatus: boolean;
}

const header = React.memo(function Header({ authStatus }: HeaderProps) {
  const {
    categories,
    selectedCategory,
    selectedOption,
    isSearching,
    searchValue,
    activeMenu,
    handleSelectCategory,
    handleSelectOption,
    handleOpenSearchBar,
    handleMouseLeaveCategory,
    handleChangeSearchValue,
    handleSearchIconClick,
  } = useHeaderAction();

  return (
    <>
      <div className="pointer-events-none absolute left-0 top-0 h-1 w-full bg-transparent" />
      <div
        className={cn(
          'sticky top-0 z-30 mx-auto flex w-full min-w-[1366px] flex-col bg-white',
          (isSearching || selectedCategory) &&
            'border-b border-dashed border-pink-500',
          !selectedCategory &&
            !isSearching &&
            'border-b-[0.1rem] border-gray-500'
        )}
      >
        <TopUtil authStatus={authStatus} />
        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          handleSelectCategory={handleSelectCategory}
          handleOpenSearchBar={handleOpenSearchBar}
          isSearching={isSearching}
          handleMouseLeaveCategory={handleMouseLeaveCategory}
          activeMenu={activeMenu}
          selectedOption={selectedOption}
          handleSelectOption={handleSelectOption}
          searchValue={searchValue}
          handleChangeSearchValue={handleChangeSearchValue}
          handleSearchIconClick={handleSearchIconClick}
        />
      </div>
    </>
  );
});

export default header;
