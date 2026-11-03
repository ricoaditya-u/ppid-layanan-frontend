export interface HierarchyData {
  title: string
  body: string
  hierarchy?: HierarchyData[]
}

export const hierarchyDataFromJson = (json: any): HierarchyData => {
  return {
    title: json.title,
    body: json.body,
    hierarchy: json.hierarchy ? json.hierarchy.map((item: any) => hierarchyDataFromJson(item)) : []
  }
}
