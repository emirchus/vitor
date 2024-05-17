import React from "react";

export interface AppRoute {
  path: string;
  exact?: boolean;
  label: string;
  icon: React.ReactNode;
}