export function mappingObjectId(items: any[]) {
  console.log(items);
  return (items || []).map((item) => Object.assign({}, item, { _id: item._id.$oid }));
}
