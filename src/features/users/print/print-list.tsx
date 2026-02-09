import { useAssets } from "@/api/fetch-assets";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, ClipboardList, MapPin, Tag, Trash } from "lucide-react";
import { useIdStore } from "../store";
import { AssetFormValues } from "@/lib/utils";
import Spinner from "@/components/ui/spinner";

const PrintList = () => {
  const { ids, deleteSelectedId } = useIdStore();
  const { data, isLoading } = useAssets({
    id: String(ids),
    limit: "9999", // Use a number larger than your total database count
    sort: "location:asc",
  });
  if (isLoading) return <Spinner />;
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-4">
      {ids.length > 0 &&
        data.data.map((asset: AssetFormValues) => (
          <Card key={asset.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold truncate">
                  {asset.asset_name}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="font-mono">
                    {asset.asset_id}
                  </Badge>
                  <Trash
                    className="w-4 text-red-500 cursor-pointer"
                    onClick={() => deleteSelectedId(Number(asset.id))}
                  />
                </div>
              </div>
              <CardDescription className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(asset.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{asset.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-start gap-2">
                  <Tag className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Model / Serial</p>
                    <p className="text-muted-foreground text-xs">
                      {asset.model || "—"} / {asset.serial || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <ClipboardList className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Remarks</p>
                    <p className="text-muted-foreground text-xs">
                      {asset.remarks}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default PrintList;
