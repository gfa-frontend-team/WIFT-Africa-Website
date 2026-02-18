"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { FilterOptions } from "@/lib/api/search";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import {
  getCountryFlagUrl,
  getCountryIsoCode,
} from "@/lib/utils/countryMapping";

interface MembersFilterSidebarProps {
  filters?: FilterOptions;
  selectedRoles: string[];
  toggleRole: (role: string) => void;
  selectedChapter: string | null;
  setChapter: (id: string | null) => void;
  availability: string | null;
  setAvailability: (status: string | null) => void;
  className?: string;
}

export default function MembersFilterSidebar({
  filters,
  selectedRoles,
  toggleRole,
  selectedChapter,
  setChapter,
  availability,
  setAvailability,
  className,
}: MembersFilterSidebarProps) {
  const roles = [
    "PRODUCER",
    "DIRECTOR",
    "WRITER",
    "ACTRESS",
    "CREW",
    "BUSINESS",
  ];

  const availabilityOptions = [
    { value: "AVAILABLE", label: "Available for work" },
    { value: "BUSY", label: "Busy / On Project" },
    { value: "NOT_LOOKING", label: "Not Looking" },
  ];

  //   console.log(filters, "filters");


  return (
    <aside className={`w-full md:w-64 space-y-8 ${className}`}>
      {/* Roles Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
          Role
        </h3>
        <div className="space-y-2">
          {roles.map((role) => (
            <label
              key={role}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                                ${selectedRoles.includes(role) ? "bg-primary border-primary text-primary-foreground" : "border-input group-hover:border-primary"}
                            `}
              >
                {selectedRoles.includes(role) && <Check size={12} />}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={selectedRoles.includes(role)}
                onChange={() => toggleRole(role)}
              />
              <span className="text-sm capitalize">{role.toLowerCase()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
          Availability
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                                ${availability === null ? "border-primary" : "border-input group-hover:border-primary"}
                        `}
            >
              {availability === null && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <input
              type="radio"
              className="hidden"
              checked={availability === null}
              onChange={() => setAvailability(null)}
            />
            <span className="text-sm">Any status</span>
          </label>

          {availabilityOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                                    ${availability === option.value ? "border-primary" : "border-input group-hover:border-primary"}
                            `}
              >
                {availability === option.value && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              <input
                type="radio"
                className="hidden"
                checked={availability === option.value}
                onChange={() => setAvailability(option.value)}
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Chapters Filter (Mocked or passed via props) */}
      <div>
        <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
          Chapter
        </h3>
        <Select
          value={selectedChapter || "all"}
          onValueChange={(value) => setChapter(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Chapters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                {/* <span>🌍</span> */}
                <span>All Chapters</span>
              </div>
            </SelectItem>

            {filters?.availableChapters.map((ele) => (
              <SelectItem key={ele.id} value={ele.name}>
                <div className="flex items-center gap-2">
                  {(() => {
                    const flagCode = getCountryIsoCode(ele?.code, ele?.name);
                    if (flagCode === "AFRICA") {
                      return (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-lg shrink-0">
                          🌍
                        </div>
                      );
                    }

                    return (
                      <div className="relative w-8 h-8 shrink-0 overflow-hidden">
                        <Image
                          src={`https://flagsapi.com/${flagCode}/flat/64.png`}
                          alt={`${ele?.name} flag`}
                          className="w-8 h-8 rounded-full object-cover border border-border/50"
                          onError={(e) => {
                            // Fallback to initials if flag fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback =
                              target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                          sizes="32px"
                          width={32}
                          height={32}
                        />
                      </div>
                    );
                  })()}
                  <span>{ele.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
}
