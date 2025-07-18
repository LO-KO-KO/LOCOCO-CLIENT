'use client';

import { apiRequest } from 'app/api/apiRequest';
import type { CategoryOptionEng, CategoryNameEng } from 'types/category';
import { CategoryMetadata, getOptionLabel } from 'utils/category';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  SvgClose,
  SvgDivider,
  SvgHistory,
  SvgLikeFill,
  SvgLogin,
  SvgLogo,
  SvgMy,
  SvgOpen,
  SvgSearch,
} from '@lococo/design-system';
import Input from '@lococo/design-system/components/input/Input';
import { cn } from '@/lib/utils';
import { useScrollHeader } from './use-scroll-header';

interface TopUtilItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface CategoryBarProps {
  categories: CategoryMetadata[];
  selectedCategory: CategoryNameEng | null;
  handleSelectCategory: (key: CategoryNameEng) => void;
  handleOpenSearchBar: () => void;
  isSearching: boolean;
  handleMouseLeaveCategory: () => void;
  activeMenu: CategoryMetadata | null;
  selectedOption: CategoryOptionEng | null;
  handleSelectOption: (option: CategoryOptionEng) => void;
  searchValue: string;
  handleChangeSearchValue: (text: string) => void;
  handleSearchIconClick: () => void;
}

interface OptionBarProps {
  options: CategoryOptionEng[];
  selectedCategoryKey: CategoryNameEng;
  selectedOption: CategoryOptionEng | null;
  handleSelectOption: (option: CategoryOptionEng) => void;
  handleMouseLeaveCategory: () => void;
}

interface SearchBarProps {
  searchValue: string;
  handleChangeSearchValue: (text: string) => void;
  handleSearchIconClick: () => void;
}

export function TopUtilItem({
  icon,
  label,
  onClick,
  disabled = false,
}: TopUtilItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-[3.2rem] cursor-pointer items-center justify-center gap-[0.8rem] whitespace-nowrap px-[1.6rem] py-[1rem] disabled:cursor-not-allowed"
      disabled={disabled}
    >
      {icon}
      <p className="jp-body2 text-gray-600">{label}</p>
    </button>
  );
}
export function TopUtil({ authStatus }: { authStatus: boolean }) {
  const router = useRouter();
  const [loginLabel, setLoginLabel] = useState('ログイン');
  const { headerMarginTop } = useScrollHeader();
  useEffect(() => {
    if (authStatus) {
      setLoginLabel('ログアウト');
    } else {
      setLoginLabel('ログイン');
    }
  }, [authStatus]);

  const handleAuthClick = async () => {
    if (authStatus) {
      try {
        await apiRequest({ endPoint: '/api/auth/logout', method: 'POST' });
        router.refresh();
      } catch {
        console.error('로그아웃 실패');
      }
    } else {
      router.push('/login');
    }
  };

  return (
    <div
      style={{ marginTop: `${headerMarginTop}px` }}
      className={cn(
        'flex w-full items-center justify-end self-stretch overflow-hidden px-[11.9rem] py-[2rem] transition-all duration-300 ease-out'
      )}
    >
      <TopUtilItem
        icon={<SvgMy className="text-gray-600" size={16} />}
        label="マイページ"
        onClick={() => console.log('마이페이지 클릭')}
        disabled
      />
      <TopUtilItem
        icon={<SvgLikeFill className="text-gray-600" size={16} />}
        label="お気に入り"
        onClick={() => console.log('좋아요 클릭')}
        disabled
      />
      <TopUtilItem
        icon={<SvgHistory className="text-gray-600" size={16} />}
        label="最近見た商품"
        onClick={() => console.log('내역 클릭')}
        disabled
      />
      <TopUtilItem
        icon={
          authStatus ? (
            <SvgOpen className="fill-gray-600" size={16} />
          ) : (
            <SvgLogin className="text-gray-600" size={16} />
          )
        }
        label={loginLabel}
        onClick={handleAuthClick}
      />
    </div>
  );
}

export function CategoryBar({
  categories,
  selectedCategory,
  handleSelectCategory,
  handleOpenSearchBar,
  isSearching,
  handleMouseLeaveCategory,
  activeMenu,
  selectedOption,
  handleSelectOption,
  searchValue,
  handleChangeSearchValue,
  handleSearchIconClick,
}: CategoryBarProps) {
  return (
    <div
      className="relative mx-auto w-full"
      onMouseLeave={handleMouseLeaveCategory}
    >
      <div className="mx-auto flex h-[6.4rem] w-[1366px] items-center gap-[2rem] px-[11.9rem]">
        <Link href="/">
          <SvgLogo className="h-[2.7rem] w-[16rem] shrink-0" />
        </Link>

        <div className="flex h-[6rem] flex-grow items-center">
          {categories.map(({ key, name }) => {
            const isActive = key === selectedCategory;
            return (
              <Link
                href={`/search?middleCategory=${key}&searchType=PRODUCT`}
                key={key}
                className={cn(
                  'jp-title2 flex h-[6rem] cursor-pointer items-center whitespace-nowrap px-[3.2rem] pb-[1rem] pt-[1rem] font-bold',
                  isActive ? 'text-pink-500' : 'text-gray-800'
                )}
                onMouseEnter={() => handleSelectCategory(key)}
                onClick={() => handleSelectCategory(key)}
              >
                {name}
              </Link>
            );
          })}
        </div>
        <div
          className="flex h-[6.4rem] w-[6.4rem] shrink-0 cursor-pointer items-center justify-center p-[1.4rem]"
          onClick={handleOpenSearchBar}
        >
          {isSearching ? <SvgClose /> : <SvgSearch />}
        </div>
      </div>
      {isSearching && (
        <SearchBar
          searchValue={searchValue}
          handleChangeSearchValue={handleChangeSearchValue}
          handleSearchIconClick={handleSearchIconClick}
        />
      )}
      {!isSearching && activeMenu && (
        <OptionBar
          options={activeMenu.options}
          selectedCategoryKey={activeMenu.key}
          selectedOption={selectedOption}
          handleSelectOption={handleSelectOption}
          handleMouseLeaveCategory={handleMouseLeaveCategory}
        />
      )}
    </div>
  );
}

export function OptionBar({
  options,
  selectedOption,
  selectedCategoryKey,
  handleSelectOption,
}: OptionBarProps) {
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+1px)] z-50 mx-auto flex h-[5.2rem] w-full min-w-[1366px] items-center border-b border-solid border-pink-500 bg-white">
      <div className="mx-auto flex h-[6.4rem] w-[1366px] items-center gap-[2rem] px-[11.9rem]">
        {options.map((option, index) => {
          const isActive = option === selectedOption;
          const isLast = index === options.length - 1;
          const label = getOptionLabel(selectedCategoryKey, option);
          let url = '';
          if (option === 'ALL') {
            url = `/search?middleCategory=${selectedCategoryKey}&searchType=PRODUCT`;
          } else {
            url = `/search?middleCategory=${selectedCategoryKey}&subCategory=${option}&searchType=PRODUCT`;
          }
          return (
            <div
              key={`option-${option}`}
              className="flex h-[3.2rem] items-center justify-center gap-[1rem]"
            >
              <Link
                href={url}
                className={cn(
                  'jp-body2 cursor-pointer whitespace-nowrap px-[2.4rem] py-[1rem] hover:text-pink-500',
                  isActive ? 'font-bold text-pink-500' : 'text-gray-600'
                )}
                onClick={() => handleSelectOption(option)}
              >
                {label}
              </Link>
              {!isLast && <SvgDivider className="h-[1.2rem] w-[0.1rem]" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SearchBar({
  searchValue,
  handleChangeSearchValue,
  handleSearchIconClick,
}: SearchBarProps) {
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      router.push(
        `/search?keyword=${encodeURIComponent(searchValue)}&searchType=PRODUCT`
      );
      handleSearchIconClick();
    }
  };
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+1px)] z-50 mx-auto flex h-[5.2rem] w-full min-w-[1366px] items-center border-b border-solid border-pink-500 bg-white">
      <div className="mx-auto flex h-[6.4rem] w-[1366px] items-center">
        <div className="flex h-[6.4rem] w-[1366px] items-center gap-[2rem] px-[11.9rem]">
          <Input
            type="search"
            value={searchValue}
            onChange={(e) => handleChangeSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ラネージュ"
            className="jp-title2 w-full text-right font-bold leading-[3rem] text-gray-800"
          />
          {searchValue.trim() ? (
            <Link
              href={`/search?keyword=${encodeURIComponent(searchValue)}&searchType=PRODUCT`}
              className="flex h-[6.4rem] w-[6.4rem] shrink-0 cursor-pointer items-center justify-center p-[1.4rem]"
              onClick={handleSearchIconClick}
            >
              <SvgSearch className="cursor-pointer" />
            </Link>
          ) : (
            <div className="flex h-[6.4rem] w-[6.4rem] shrink-0 cursor-pointer items-center justify-center p-[1.4rem]">
              <SvgSearch className="cursor-pointer" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
