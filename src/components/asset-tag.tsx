import React from "react";
import { QRCodeSVG } from "qrcode.react";

export interface Asset {
  id: string;
  asset_id: string;
  asset_name: string | null;
  date: string | null;
  location: string;
  model: string | null;
  serial: string | null;
  remarks: string | null;
  category?: string;
}

export enum AssetCategory {
  BUILDING = "Building",
  MACHINERY = "Machinery & Equipment",
  TOOLS_FURNITURE = "Tools & Furniture",
  LAND_BUILDING = "Land & Building Improvement",
  TRANSPORTATION = "Transportation",
  OFFICE_IT = "Office & IT Equipment",
  OTHER = "Other",
}

interface AssetTagProps {
  asset: Asset;
  className?: string;
}

const AssetTag: React.FC<AssetTagProps> = ({ asset, className = "" }) => {
  const qrValue = JSON.stringify({
    id: asset.asset_id,
    name: asset.asset_name,
    sn: asset.serial,
  });

  return (
    <div
      className={`w-[400px] bg-white border-2 border-black overflow-hidden print:shadow-none shadow-md ${className}`}
    >
      {/* Header */}
      <div className="border-b-2 border-black bg-white py-0.5 text-center">
        <h1 className="text-[10px] font-bold uppercase tracking-widest leading-tight">
          ARKRAY Industry INC
        </h1>
      </div>

      {/* Date & Location */}
      <div className="grid grid-cols-2 border-b-2 border-black bg-slate-50/30">
        <div className="border-r-2 border-black px-2 py-0.5 flex  justify-start items-center gap-1">
          <span className="text-[8px] font-bold text-slate-500 uppercase leading-none">
            Date:
          </span>
          <span className="text-[9px] font-bold uppercase">
            {asset.date || "N/A"}
          </span>
        </div>
        <div className="px-2 py-0.5 flex flex-col justify-center">
          <span className="text-[8px] font-bold text-slate-500 uppercase leading-none">
            Location:
          </span>
          <span className="text-[8px] font-medium uppercase truncate">
            {asset.location || "N/A"}
          </span>
        </div>
      </div>

      {/* Asset ID */}
      <div className="border-b-2 border-black px-2 py-0.5 flex  items-center gap-1 bg-white">
        <span className="text-[8px] font-bold text-slate-500 uppercase leading-none">
          Asset ID:
        </span>
        <span className="text-xs font-bold tracking-widest mono leading-tight">
          {asset.asset_id}
        </span>
      </div>

      {/* Asset Name & QR Row - Reduced Height */}
      <div className="grid grid-cols-[1fr_74px] border-b-2 border-black bg-white min-h-[64px]">
        <div className="border-r-2 border-black px-2 py-1 flex flex-col justify-center">
          <span className="text-[8px] font-bold text-slate-500 uppercase leading-none mb-0.5">
            Asset Name:
          </span>
          <span className="text-xs font-black leading-tight uppercase line-clamp-2">
            {asset.asset_name || "UNNAMED ASSET"}
          </span>
        </div>
        <div className="p-1 flex items-center justify-center bg-white">
          <QRCodeSVG
            value={qrValue}
            size={56}
            level="M"
            includeMargin={false}
          />
        </div>
      </div>

      {/* Model & Serial Row - Added extra vertical padding for space */}
      <div className="grid grid-cols-2 bg-white">
        <div className="border-r-2 border-black px-2 py-1.5 flex flex-col justify-center">
          <span className="text-[8px] font-bold text-slate-500 uppercase leading-none">
            Model:
          </span>
          <span className="text-[9px] font-bold truncate mt-1 leading-none">
            {asset.model || "N/A"}
          </span>
        </div>
        <div className="px-2 py-1.5 flex flex-col justify-center">
          <span className="text-[8px] font-bold text-slate-500 uppercase leading-none">
            Serial No:
          </span>
          <span className="text-[9px] font-bold truncate uppercase mt-1 leading-none">
            {asset.serial || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AssetTag;
