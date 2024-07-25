export class RefreshTokenResponseDTO {
  public static fromModels(models: any): RefreshTokenResponseDTO {
    return {
      access_token: models.access_token,
      refresh_token: models.refresh_token,
    };
  }
}
