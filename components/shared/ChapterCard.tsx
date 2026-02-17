import { Users, MapPin, Crown, User, Info, MapPinCheckInside } from "lucide-react";
import Link from "next/link";
import { getCountryIsoCode } from "@/lib/utils/countryMapping";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/useAuth";

interface ChapterCardProps {
  id?: string;
  name: string;
  code: string;
  country: string;
  city?: string;
  description?: string;
  memberCount: number;
  president?: string;
  admin?: string;
  isSelected?: boolean;
  onClick?: () => void;
  actionLabel?: string;
  actionLink?: string;
  chapterId?:string;
}

export default function ChapterCard({
  // id,
  name,
  code,
  country,
  city,
  description,
  memberCount,
  president,
  admin,
  isSelected,
  onClick,
  actionLabel,
  actionLink,
  chapterId
}: ChapterCardProps) {
  const isHQ = code === "HQ";
  const flagCode = getCountryIsoCode(code, country);

  const {chapterId:myChapterID} = useAuth()

  const isMyChapter = myChapterID === chapterId


  return (
    <div
      onClick={onClick}
      className={`group relative bg-card rounded-2xl overflow-hidden transition-all duration-300 ${
        onClick ? "cursor-pointer hover:-translate-y-1" : ""
      } ${
        isSelected
          ? "border-2 border-primary ring-4 ring-primary/10 shadow-lg"
          : "border border-border hover:shadow-xl"
      }`}
    >
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16 pointer-events-none" />

      <div className="relative p-6 flex flex-col h-full">
        {/* Country & Flag */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-full border border-border/50">
              {flagCode === "AFRICA" ? (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-2xl">
                  🌍
                </div>
              ) : (
                <Image
                  src={`https://flagsapi.com/${flagCode}/flat/64.png`}
                  alt={`${country} flag`}
                  fill
                  sizes="64px" // Optimizes performance for small icons
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground leading-tight">
                {country}
              </h3>
              {city && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <MapPin className="h-3 w-3" />
                  {city}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-1">
            {isHQ && (
              <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full flex items-center gap-1">
                <Crown className="h-3 w-3" />
                HQ
              </span>
            )}
            {isMyChapter && (
              <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full flex items-center gap-1">
                <MapPinCheckInside className="h-3 w-3" />
                My Chapter
              </span>
            )}
          </div>
        </div>

        {/* Chapter Name */}
        <div className="mb-4">
          <h4 className="text-xl font-bold text-primary capitalize">{name}</h4>
        </div>

        {/* Info Grid */}
        <div className="space-y-3 mb-4 flex-grow">
          {president && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/5 rounded-md">
                <Crown className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  President
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {president}
                </p>
              </div>
            </div>
          )}

          {admin && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/5 rounded-md">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Head of Operations
                </p>
                <p className="text-sm font-semibold text-foreground">{admin}</p>
              </div>
            </div>
          )}
        </div>

        {/* Active Members Badge */}
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4 bg-primary/5 px-3 py-2 rounded-lg w-full">
          <Users className="h-4 w-4 text-primary" />
          <span>
            {memberCount > 0 ? memberCount.toLocaleString() : 0} active members
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-4" />

        {/* Description */}
        {description && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Footer Action */}
        <div className="mt-auto">
          {actionLink ? (
            <Link
              href={actionLink}
              className="block w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors text-center shadow-sm"
            >
              {actionLabel || "View Chapter"}
            </Link>
          ) : actionLabel && onClick ? (
            <button
              className={`block w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-center shadow-sm ${
                isSelected
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-accent text-accent-foreground hover:bg-accent/80"
              }`}
            >
              {isSelected ? "Selected" : actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
