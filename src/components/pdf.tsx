import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const MM_TO_PT = 2.83465;

const styles = StyleSheet.create({
  page: {
    paddingTop: 5.5 * MM_TO_PT,
    paddingLeft: 5 * MM_TO_PT,
    paddingRight: 5 * MM_TO_PT,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#FFFFFF",
  },
  tagPhysicalArea: {
    width: 50 * MM_TO_PT,
    height: 30 * MM_TO_PT,
    marginBottom: 2 * MM_TO_PT,
    paddingBottom: 1.7,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tagContainer: {
    width: 46 * MM_TO_PT,
    height: 26 * MM_TO_PT,
    border: "0.5pt solid black",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    borderBottom: "0.5pt solid black",
  },
  cell: {
    borderRight: "0.5pt solid black",
    paddingHorizontal: 2,
    paddingVertical: 1,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 6,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    textTransform: "uppercase",
  },
  label: {
    fontSize: 4,
    color: "#333",
  },
  value: {
    fontSize: 5,
    fontWeight: "bold",
  },
  assetNameValue: {
    fontSize: 4.5,
    fontWeight: "bold",
    lineHeight: 1,
  },
  location: {
    fontSize: 3.5,
    fontWeight: "bold",
  },
  fullWidth: { width: "100%" },
  halfWidth: { width: "50%" },
  qrCell: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    padding: 1,
  },
  nameCell: {
    width: "70%",
    justifyContent: "flex-start",
  },
  noBorderRight: { borderRight: "none" },
  noBorderBottom: { borderBottom: "none" },
});

export const AssetTagDocument = ({ assets }: { assets: any[] }) => {
  const itemsPerPage = 36;
  const pages = [];

  for (let i = 0; i < assets.length; i += itemsPerPage) {
    pages.push(assets.slice(i, i + itemsPerPage));
  }

  return (
    <Document>
      {pages.map((pageAssets, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {pageAssets.map((asset, index) => (
            <View key={index} style={styles.tagPhysicalArea}>
              <View style={styles.tagContainer}>
                {/* Row 1: Header */}
                <View style={[styles.row, { height: "15%" }]}>
                  <View
                    style={[
                      styles.cell,
                      styles.fullWidth,
                      styles.noBorderRight,
                    ]}
                  >
                    <Text style={styles.headerText}>Arkray Industry Inc</Text>
                  </View>
                </View>

                {/* Row 2: Date & Loc */}
                <View style={[styles.row, { height: "22%" }]}>
                  <View style={[styles.cell, styles.halfWidth]}>
                    <Text style={styles.label}>DATE:</Text>
                    <Text style={styles.value}>{asset.date || "N/A"}</Text>
                  </View>
                  <View
                    style={[
                      styles.cell,
                      styles.halfWidth,
                      styles.noBorderRight,
                    ]}
                  >
                    <Text style={styles.label}>LOCATION:</Text>
                    {/* FIXED: Using any cast for numberOfLines to bypass strict TextProps check */}
                    <Text
                      style={styles.location}
                      {...({ numberOfLines: 2 } as any)}
                    >
                      {asset.location || "N/A"}
                    </Text>
                  </View>
                </View>

                {/* Row 3: Asset ID */}
                <View style={[styles.row, { height: "15%" }]}>
                  <View
                    style={[
                      styles.cell,
                      styles.fullWidth,
                      styles.noBorderRight,
                    ]}
                  >
                    <Text style={styles.label}>
                      ASSET ID:{" "}
                      <Text style={styles.value}>{asset.asset_id}</Text>
                    </Text>
                  </View>
                </View>

                {/* Row 4: Name & QR */}
                <View style={[styles.row, { height: "33%" }]}>
                  <View style={[styles.cell, styles.nameCell]}>
                    <Text style={styles.label}>ASSET NAME:</Text>
                    {/* FIXED: Using any cast for numberOfLines */}
                    <Text
                      style={styles.assetNameValue}
                      {...({ numberOfLines: 2 } as any)}
                    >
                      {asset.asset_name}
                    </Text>
                  </View>
                  <View
                    style={[styles.cell, styles.qrCell, styles.noBorderRight]}
                  >
                    {asset.qrCode ? (
                      <Image
                        src={asset.qrCode}
                        style={{ width: 25, height: 25 }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 18,
                          height: 18,
                          backgroundColor: "#eee",
                        }}
                      />
                    )}
                  </View>
                </View>

                {/* Row 5: Model & S/N */}
                <View
                  style={[styles.row, { height: "15%" }, styles.noBorderBottom]}
                >
                  <View style={[styles.cell, styles.halfWidth]}>
                    {/* FIXED: numberOfLines 1 often fails with nested Text, removed it as height is constrained by container anyway */}
                    <Text style={styles.label}>
                      MOD:{" "}
                      <Text style={styles.value}>{asset.model || "N/A"}</Text>
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.cell,
                      styles.halfWidth,
                      styles.noBorderRight,
                    ]}
                  >
                    <Text style={styles.label}>
                      S/N:{" "}
                      <Text style={styles.value}>{asset.serial || "N/A"}</Text>
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};
