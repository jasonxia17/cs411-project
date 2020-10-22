export function convertCourseIdToString(courseId: string | string[]): string {
  if (Array.isArray(courseId)) {
    return courseId[0] as string;
  }
  return courseId;
}
