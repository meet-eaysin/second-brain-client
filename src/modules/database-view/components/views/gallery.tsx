import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Image } from "lucide-react";
import type {
  IDatabaseView,
  IDatabaseProperty,
  DatabaseRecord,
} from "@/modules/database-view";
import {
  normalizeSelectValue,
  getSelectOptionDisplay,
  getSelectOptionId,
  getSelectOptionColor,
} from "@/modules/database-view/utils/select-option-utils";
import { NoDataMessage } from "../../../../components/no-data-message.tsx";

interface DocumentGalleryViewProps {
  view: IDatabaseView;
  properties: IDatabaseProperty[];
  records: DatabaseRecord[];
  onRecordEdit?: (record: DatabaseRecord) => void;
  onRecordDelete?: (recordId: string) => void;
}

export function Gallery({
  view,
  properties,
  records,
  onRecordEdit,
  onRecordDelete,
}: DocumentGalleryViewProps) {
  // Filter properties based on view's visible properties for display
  const visibleProperties = properties.filter((property) => {
    if (
      view?.settings?.visibleProperties &&
      view.settings.visibleProperties.length > 0
    ) {
      return view.settings.visibleProperties.includes(property.id);
    }
    return property.isVisible !== false;
  });

  // Find image/URL property for gallery display
  const imageProperty =
    visibleProperties.find((p) => p.type === "URL") ||
    visibleProperties.find((p) => p.name.toLowerCase().includes("image")) ||
    visibleProperties.find((p) => p.name.toLowerCase().includes("photo"));

  // Find title property
  const titleProperty =
    visibleProperties.find((p) => p.type === "TEXT") || visibleProperties[0];

  // Get other properties to display
  const displayProperties = visibleProperties
    .filter((p) => p.id !== imageProperty?.id && p.id !== titleProperty?.id)
    .slice(0, 3); // Show max 3 additional properties

  const renderRecordCard = (record: DatabaseRecord) => {
    const titleValue = titleProperty
      ? record.properties[titleProperty.id]
      : "Untitled";
    const title =
      typeof titleValue === "object"
        ? getSelectOptionDisplay(titleValue)
        : String(titleValue || "Untitled");
    const imageUrl = imageProperty ? record.properties[imageProperty.id] : null;

    return (
      <Card
        key={record.id}
        className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden"
        onClick={() => onRecordEdit?.(record)}
      >
        {/* Image Section */}
        <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={String(imageUrl)}
              alt={String(title)}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}

          {/* Fallback when no image or image fails to load */}
          <div
            className={`flex items-center justify-center w-full h-full ${
              imageUrl ? "hidden" : ""
            }`}
          >
            <Image className="h-12 w-12 text-muted-foreground" />
          </div>

          {/* Actions Overlay */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onRecordEdit?.(record);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onRecordDelete?.(record.id);
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content Section */}
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium line-clamp-2">
            {title || "Untitled"}
          </CardTitle>
        </CardHeader>

        {displayProperties.length > 0 && (
          <CardContent className="pt-0">
            <div className="space-y-2">
              {displayProperties.map((property) => {
                const value = record.properties[property.id];
                if (!value) return null;

                return (
                  <div
                    key={property.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-muted-foreground font-medium">
                      {property.name}
                    </span>
                    <div className="text-xs">
                      {property.type === "SELECT" ? (
                        <Badge
                          variant="outline"
                          className="text-xs text-white border-0"
                          style={{
                            backgroundColor: getSelectOptionColor(
                              normalizeSelectValue(value, false)
                            ),
                          }}
                        >
                          {getSelectOptionDisplay(
                            normalizeSelectValue(value, false)
                          )}
                        </Badge>
                      ) : property.type === "MULTI_SELECT" ? (
                        <div className="flex flex-wrap gap-1">
                          {normalizeSelectValue(value, true).map(
                            (option: unknown, index: number) => (
                              <Badge
                                key={getSelectOptionId(option) || index}
                                variant="outline"
                                className="text-xs text-white border-0"
                                style={{
                                  backgroundColor: getSelectOptionColor(option),
                                }}
                              >
                                {getSelectOptionDisplay(option)}
                              </Badge>
                            )
                          )}
                        </div>
                      ) : property.type === "CHECKBOX" ? (
                        <Badge
                          variant={value ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {value ? "Yes" : "No"}
                        </Badge>
                      ) : property.type === "DATE" ? (
                        <span className="text-muted-foreground">
                          {new Date(String(value)).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-right max-w-[100px] truncate">
                          {String(value)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {records.map(renderRecordCard)}
      </div>

      {/* Empty State */}
      {records.length === 0 && (
        <NoDataMessage message="No records to display" icon={Image} />
      )}
    </div>
  );
}
