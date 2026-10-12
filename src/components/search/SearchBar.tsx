import React from "react";
import MultiProductSearchBar, { MultiProductSearchBarProps } from "./MultiProductSearchBar";

export interface SearchBarProps extends MultiProductSearchBarProps {
  className?: string;
}

export default function SearchBar(props: SearchBarProps) {
  return <MultiProductSearchBar {...props} />;
}
