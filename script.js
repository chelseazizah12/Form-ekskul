const form = document.getElementById("formEkskul");
const inputNama = document.getElementById("nama");
const selectJurusan = document.getElementById("jurusan");
const selectEkskul = document.getElementById("ekskul");
const btnSubmit = document.getElementById("btnSubmit");
const btnBatal = document.getElementById("btnBatal");
const pesan = document.getElementById("pesan");
const tabelBody = document.getElementById("tabelBody");

let dataSiswa = [];
let editIndex = null;

// Data awal seperti pada contoh


function ambilKelas() {
  const dipilih = document.querySelector('input[name="kelas"]:checked');
  return dipilih ? dipilih.value : "";
}

function escapeHTML(teks) {
  const div = document.createElement("div");
  div.textContent = teks;
  return div.innerHTML;
}

function render() {
  if (dataSiswa.length === 0) {
    tabelBody.innerHTML = '<tr><td colspan="6" class="kosong">Belum ada data pendaftaran.</td></tr>';
    return;
  }

  tabelBody.innerHTML = dataSiswa
    .map(
      (s, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHTML(s.nama)}</td>
        <td>${s.kelas}</td>
        <td>${s.jurusan}</td>
        <td>${s.ekskul}</td>
        <td class="aksi">
          <button class="btn-edit" data-aksi="edit" data-index="${i}">Edit</button>
          <button class="btn-delete" data-aksi="delete" data-index="${i}">Delete</button>
        </td>
      </tr>`
    )
    .join("");
}

function resetForm() {
  form.reset();
  editIndex = null;
  btnSubmit.textContent = "Tambah Data";
  btnBatal.hidden = true;
  pesan.textContent = "";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nama = inputNama.value.trim();
  const kelas = ambilKelas();
  const jurusan = selectJurusan.value;
  const ekskul = selectEkskul.value;

  if (!nama || !kelas || !jurusan || !ekskul) {
    pesan.textContent = "Semua kolom wajib diisi.";
    return;
  }

  const siswa = { nama, kelas, jurusan, ekskul };

  if (editIndex === null) {
    dataSiswa.push(siswa);
  } else {
    dataSiswa[editIndex] = siswa;
  }

  resetForm();
  render();
});

tabelBody.addEventListener("click", function (e) {
  const tombol = e.target.closest("button");
  if (!tombol) return;

  const index = Number(tombol.dataset.index);

  if (tombol.dataset.aksi === "edit") {
    const s = dataSiswa[index];
    inputNama.value = s.nama;
    document.querySelector(`input[name="kelas"][value="${s.kelas}"]`).checked = true;
    selectJurusan.value = s.jurusan;
    selectEkskul.value = s.ekskul;

    editIndex = index;
    btnSubmit.textContent = "Simpan Perubahan";
    btnBatal.hidden = false;
    pesan.textContent = "";
    inputNama.focus();
  }

  if (tombol.dataset.aksi === "delete") {
    if (confirm("Hapus data " + dataSiswa[index].nama + "?")) {
      dataSiswa.splice(index, 1);
      if (editIndex !== null) resetForm();
      render();
    }
  }
});

btnBatal.addEventListener("click", resetForm);

render();