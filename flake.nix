{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    prisma-utils.url = "github:VanCoding/nix-prisma-utils";
  };

  outputs =
    { nixpkgs, prisma-utils, ... }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      prisma =
        (prisma-utils.lib.prisma-factory {
          inherit pkgs;
          # just copy these hashes for now, and then change them when nix complains about the mismatch
          prisma-fmt-hash = "sha256-UkXYeYFaAJ7bFzyZT7IK2D+TEcbYDjHhng+c//u2zEk=";
          query-engine-hash = "sha256-tbSa121A1HGL0SByZrsEGYl8kFOM6WsrQ+/puChwUbo=";
          libquery-engine-hash = "sha256-IKuYv7zZk9+7KBeVEAcrJX/7eTnu0BspQwPqGWCsovw=";
          schema-engine-hash = "sha256-21Spyc0gydbbyCQAkeBa3+fXDc6NSbtVUyXi4mpyw04=";
        }).fromBunLock
          ./bun.lock;
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        env = prisma.env;
      };
    };
}
