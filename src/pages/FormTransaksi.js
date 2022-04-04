import React from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { baseUrl, authorization } from "../config.js";
import NavbarPage from "../components/NavbarPage.js";
import { MdDelete } from "react-icons/md"
import { BiEdit } from "react-icons/bi"

export default class FormTransaksi extends React.Component {
	constructor() {
		super()
		this.state = {
			id_member: "",
			tgl: "",
			batas_waktu: "",
			tgl_bayar: "",
			dibayar: "",
			id_user: "",
			detail_transaksi: [],
			members: [],
			pakets: [],
			id_paket: "",
			qty: 0,
			jenis_paket: "",
			harga: 0
		}

		if (!localStorage.getItem("token")) {
			window.location.href = "/auth"
		}
	}

	getMember() {
		let endpoint = `${baseUrl}/member`
		axios.get(endpoint, authorization)
			.then(response => {
				this.setState({ members: response.data })
			})
			.catch(error => console.log(error))
	}

	getPaket() {
		let endpoint = `${baseUrl}/paket`
		axios.get(endpoint, authorization)
			.then(response => {
				this.setState({ pakets: response.data })
			})
			.catch(error => console.log(error))
	}

	componentDidMount() {
		this.getMember()
		this.getPaket()

		let user = JSON.parse(localStorage.getItem("user"))

		if (user.role !== 'Admin' && user.role !== 'Kasir') {
			window.alert(`Maaf Anda tidak berhak untuk mengakses halaman ini`
			)

			window.location.href = "/"
		}
	}

	tambahPaket(e) {
		e.preventDefault()
		// tutup modal
		this.modal.hide()
		// utk menyimpan data paket yg dipilih beserta jumlahnya
		// ke dalam array detail_transaksi
		let idPaket = this.state.id_paket
		let selectedPaket = this.state.pakets.find(
			paket => paket.id_paket == idPaket
		)
		let newPaket = {
			id_paket: this.state.id_paket,
			qty: this.state.qty,
			jenis_paket: selectedPaket.jenis_paket,
			harga: selectedPaket.harga
		}

		// Ambil array detail_transaksi
		let temp = this.state.detail_transaksi
		temp.push(newPaket)
		this.setState({ detail_transaksi: temp })
	}


	addPaket() {
		// menampilkan form modal utk memilih paket
		this.modal = new Modal(
			document.getElementById('modal_paket')
		)
		this.modal.show()

		// kosongkan form nya
		this.setState({
			id_paket: "",
			qty: 0,
			jenis_paket: "",
			harga: 0
		})
	}

	simpanTransaksi() {
		if (document.getElementById("member").value == "") {
			alert("missing member");
			return;
		}
		if (document.getElementById("tgl").value == "") {
			alert("missing tanggal transaksi");
			return;
		}
		if (document.getElementById("batas_waktu").value == "") {
			alert("missing batas waktu");
			return;
		}
		if (document.getElementById("status").value == "") {
			alert("missing status");
			return;
		}
		if (document.getElementById("pilih").value == "") {
			alert("Tidak ada paket yang dipilih");
			return;
		}
		if (document.getElementById("jml").value == "") {
			alert("Jumlah paket belum diinput");
			return;
		}

		let endpoint = `${baseUrl}/transaksi`
		let user = JSON.parse(localStorage.getItem("user"))
		let newData = {
			id_member: this.state.id_member,
			tgl: this.state.tgl,
			batas_waktu: this.state.batas_waktu,
			tgl_bayar: this.state.tgl_bayar,
			dibayar: this.state.dibayar,
			id_user: user.id_user,
			detail_transaksi: this.state.detail_transaksi,
		}

		axios
			.post(endpoint, newData, authorization)
			.then(response => {
				window.alert(response.data.message)
			})
			.catch(error => console.log(error))
	}

	hapusData(id_paket) {
		if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {

			//mencari posisi index dari data yang akan dihapus
			let temp = this.state.detail_transaksi
			let index = temp.findIndex(detail => detail.id_paket === id_paket)

			//menghapus data pada array
			temp.splice(index, 1)

			this.setState({ detail: temp })
		}
	}

	render() {
		return (
			<div className="Section">
				<NavbarPage /><br />
				<div className="container">
					<div className="card">
						<div className="card-header">
							<div className="card-header bg-gradient-primary">
								<h4 className="text-white">
									&nbsp;<BiEdit size={25} color="white" /> Form Transaksi
								</h4>
							</div>
						</div>

						<div className="card-body">
							Member
							<select className="form-control mb-2" id="member"
								value={this.state.id_member}
								onChange={e => this.setState({ id_member: e.target.value })}>
								<option value="">--Pilih Member--</option>
								{this.state.members.map(member => (
									<option value={member.id_member}>
										{member.nama}
									</option>
								))}
							</select>

							Tanggal Transaksi
							<input type="date" className="form-control mb-2" id="tgl"
								value={this.state.tgl}
								onChange={e => this.setState({ tgl: e.target.value })} />

							Batas Waktu
							<input type="date" className="form-control mb-2" id="batas_waktu"
								value={this.state.batas_waktu}
								onChange={e => this.setState({ batas_waktu: e.target.value })} />

							Tanggal Bayar
							<input type="date" className="form-control mb-2"
								value={this.state.tgl_bayar}
								onChange={e => this.setState({ tgl_bayar: e.target.value })} />

							Status Bayar
							<select className="form-control mb-2" id="status"
								value={this.state.dibayar}
								onChange={e => this.setState({ dibayar: e.target.value })}>
								<option value="">Pilih Status Pembayaran</option>
								<option value={false}> Belum dibayar </option>
								<option value={true}> Sudah dibayar </option>
							</select>

							<button className="btn btn-outline-success"
								onClick={() => this.addPaket()}>
								Pilih Paket
							</button>

							{/* tampilkan isi detail */}
							<h5>Detail Transaksi</h5>
							{this.state.detail_transaksi.map(detail => (
								<div className="row mb-2">
									{/* area nama paket col-3 */}
									<div className="col-lg-3">
										{detail.jenis_paket}
									</div>
									{/* area quantity col-2*/}
									<div className="col-lg-2">
										Qty: {detail.qty}
									</div>
									{/* area harga paket col-3*/}
									<div className="col-lg-2">
										@ Rp {detail.harga}
									</div>
									{/* area harga total col-4  */}
									<div className="col-lg-3">
										Rp {detail.harga * detail.qty}
									</div>
									<div className="col-lg-2">
										<button className="btn btn-danger1 btn-sm"
											onClick={() => this.hapusData(detail.id_paket)}>
											<MdDelete size={18} color="white" /> Delete
										</button>
									</div>
								</div>
							))}

							<button className="btn btn-primary"
								onClick={() => this.simpanTransaksi()}>Simpan</button>

							{/* Modal utk pilihan paket */}
							<div className="modal" id="modal_paket">
								<div className="modal-dialog modal-md">
									<div className="modal-content">
										<div className="modal-header bg-gradient-success">
											<h4 className="text-white">
												Pilih Paket
											</h4>
										</div>
										<div className="modal-body">
											<form onSubmit={(e) => this.tambahPaket(e)}>
												Pilih Paket
												<select className="form-control mb-2" id="pilih"
													value={this.state.id_paket}
													onChange={e => this.setState({ id_paket: e.target.value })}>
													<option value="">--Pilih Paket--</option>
													{this.state.pakets.map(paket => (
														<option value={paket.id_paket}>
															{paket.jenis_paket}
														</option>
													))}
												</select>

												Jumlah (Qty)
												<input type="number" className="form-control mb-2" id="jml"
													value={this.state.qty}
													onChange={e => this.setState({ qty: e.target.value })} />

												<button type="submit" className="btn btn-success">
													Tambah
												</button>
											</form>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}