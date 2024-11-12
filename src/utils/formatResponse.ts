export default function formatResponse(
  newToken: string | null | undefined,
  data: any
) {
  type ResponseData = {
    data: any;
    newToken?: string | null;
  };
  const response: ResponseData = {
    data,
    newToken: newToken,
  };
  return response;
}
