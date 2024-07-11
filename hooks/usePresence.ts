import { db } from "@/lib/firebase";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { useEffect, useState } from "react";

const usePresence = (month: number, year: number) => {
  const [html, sethtml] = useState("");
  const [absenceData, setAbsenceData] = useState<DocumentData[] | []>([]);
  const daysInMonth = new Date(year, month, 0).getDate();
  let presenceData: DocumentData[] = [];

  const getPresences = async () => {
    try {
      const users = await getDocs(
        query(collection(db, "user"), where("role", "==", "anggota"))
      );

      users.forEach(async (doc) => {
        if (!presenceData.find((user) => user.id == doc.id)) {
          presenceData.push({
            ...doc.data(),
            id: doc.id,
            presence: {
              dinasLuar: 0,
              pendidikan: 0,
              cuti: 0,
              sakit: 0,
              ijin: 0,
              tk: 0,
              hadir: 0
            }
          });
        }

        const presences = await getDocs(
          query(collection(db, "presence"), where("user", "==", doc.id))
        );

        const userFound = presenceData.find((user) => user.id == doc.id);
        const userIndex = presenceData.findIndex((user) => user.id == doc.id);

        if (presences.empty) {
          presenceData.splice(userIndex, 1, {
            ...userFound,
            presence: {
              ...userFound?.presence,
              tk: daysInMonth
            }
          });
          return;
        }

        presenceData.splice(userIndex, 1, {
          ...userFound,
          presence: {
            ...userFound?.presence,
            tk: daysInMonth - presences.size
          }
        });

        presences.forEach((presence) => {
          const userFound = presenceData.find(
            (user) => user.id == presence.data().user
          );

          const userIndex = presenceData.findIndex(
            (user) => user.id == presence.data().user
          );

          switch (presence.data().type) {
            case "DINAS LUAR":
              presenceData.splice(userIndex, 1, {
                ...userFound,
                presence: {
                  ...userFound?.presence,
                  dinasLuar: parseInt(userFound?.presence.dinasLuar) + 1
                }
              });
              break;
            case "PENDIDIKAN":
              presenceData.splice(userIndex, 1, {
                ...userFound,
                presence: {
                  ...userFound?.presence,
                  pendidikan: parseInt(userFound?.presence.pendidikan) + 1
                }
              });
              break;
            case "CUTI":
              presenceData.splice(userIndex, 1, {
                ...userFound,
                presence: {
                  ...userFound?.presence,
                  cuti: parseInt(userFound?.presence.cuti) + 1
                }
              });
              break;
            case "SAKIT":
              presenceData.splice(userIndex, 1, {
                ...userFound,
                presence: {
                  ...userFound?.presence,
                  sakit: parseInt(userFound?.presence.sakit) + 1
                }
              });
              break;
            case "IJIN":
              presenceData.splice(userIndex, 1, {
                ...userFound,
                presence: {
                  ...userFound?.presence,
                  ijin: parseInt(userFound?.presence.ijin) + 1
                }
              });
              break;
            case "TANPA KETERANGAN":
              presenceData.splice(userIndex, 1, {
                ...userFound,
                presence: {
                  ...userFound?.presence,
                  tk: parseInt(userFound?.presence.tk) + 1
                }
              });
              break;

            default:
              presenceData.splice(userIndex, 1, {
                ...userFound,
                presence: {
                  ...userFound?.presence,
                  hadir: parseInt(userFound?.presence.hadir) + 1
                }
              });
              break;
          }
        });

        setTimeout(() => {
          setAbsenceData(presenceData);
        }, 500);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPresences();
  }, []);

  useEffect(() => {
    const base = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Presence List</title>
  <style>
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .wrapper {
      padding-block: 50px;
      padding-inline: 30px;
    }

    table,
    tr,
    th,
    td {
      border: 1px solid black;
      border-collapse: collapse;
    }

    table {
      width: 100%;
      text-align: center;
      margin-bottom: 20px;
    }

    th {
      font-weight: normal;
    }

    .footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .left,
    .right {
      text-align: center;
    }

    .left-top,
    .right-top {
      margin-bottom: 70px;
    }

    .left {
      margin-left: 20px;
    }

    .right {
      margin-right: 20px;
    }

    .location {
      display: flex;
    }

    .date-spacer {
      display: block;
      width: 40px;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <table>
      <tr>
        <th style="width: 40px;">NO</th>
        <th>NAMA</th>
        <th>NIP</th>
        <th style="width: 45px">GOL</th>
        <th style="width: 80px">JUMLAH HARI KERJA</th>
        <th style="width: 70px">DINAS LUAR</th>
        <th style="width: 100px">PENDIDIKAN</th>
        <th style="width: 45px">CUTI</th>
        <th style="width: 50px">SAKIT</th>
        <th style="width: 50px">IJIN</th>
        <th style="width: 30px">TK</th>
        <th style="width: 100px">JUMLAH KEHADIRAN HARI KERJA</th>
      </tr>
      ${absenceData.map(
        (data: DocumentData, i: number) =>
          `
            <tr>
              <td>${i + 1}</td>
              <td style="text-align: left; padding-inline: 5px">${
                data.name
              }</td>
              <td>${data.employeeId}</td>
              <td>${data.class}</td>
              <td>${daysInMonth}</td>
              <td>${data.presence.dinasLuar}</td>
              <td>${data.presence.pendidikan}</td>
              <td>${data.presence.cuti}</td>
              <td>${data.presence.sakit}</td>
              <td>${data.presence.ijin}</td>
              <td>${data.presence.tk}</td>
              <td>${data.presence.hadir}</td>
            </tr>
          `
      )}
    </table>

    <div class="footer">
      <div class="left">
        <div class="left-top">
          <p>Mengetahui</p>
          <p>Komandan Denma Koopsudmas</p>
        </div>
        <div class="left-bottom">
          <p>Kripto Bire</p>
          <p>Kolonel Kal NRP 527694</p>
        </div>
      </div>

      <div class="right">
        <div class="right-top">
          <p class="location">Jakarta, <span class="date-spacer"></span> Juli 2024</p>
          <p>Kadisops</p>
        </div>
        <div class="right-bottom">
          <p>Yosef Y. Abidondifu</p>
          <p>Mayor Pas NRP 533700</p>
        </div>
      </div>
    </div>
  </div>
</body>

</html>
`;

    // console.log(absenceData);

    sethtml(base);
  }, [absenceData]);

  return html;
};

export default usePresence;
