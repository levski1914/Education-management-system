import React from "react";

type Props = {
  role: "PARENT" | "STUDENT" | "TEACHER" | "ADMIN" | "SUPERADMIN";
};

export default function RoleSwitcher({ role }: Props) {
  switch (role) {
    case "PARENT":
      return <div>🎒 Родителски панел</div>;
    case "TEACHER":
      return <div>📚 Учителски панел</div>;
    case "ADMIN":
      return <div>🏫 Панел на директора</div>;
    case "SUPERADMIN":
      return <div>🛡️ Панел на системен админ</div>;
    case "STUDENT":
      return <div>👦 Ученически панел</div>;
    default:
      return <div>🤔 Неизвестна роля</div>;
  }
}
