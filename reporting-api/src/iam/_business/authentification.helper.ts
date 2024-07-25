export async function dynamicImport(packageName: string) {
  try {
    const module = await require(packageName);
    return module;
  } catch (error) {
    throw new Error(
      `Failed to dynamic import module "${packageName}": ${error}`,
    );
  }
}
