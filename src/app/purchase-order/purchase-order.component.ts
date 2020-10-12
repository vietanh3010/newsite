import { AfterViewInit, Component, OnInit, ValueProvider, ViewChild } from '@angular/core';
import { LoginServiceService } from '../service/login/login-service.service';
import { AdminService } from '../service/admin/admin.service';
import { UserService } from '../service/user/user.service';
import { ProductService } from '../service/product/product.service';
import { NeworderService } from '../service/neworder/neworder.service';
import { ExcelService } from '../service/excel/excel.service';
import { ProducttagService } from '../service/producttag/producttag.service';
import { SupplierService } from '../service/supplier/supplier.service';

import { Admin } from '../model/admin';
import { User } from '../model/user';
import { Product } from '../model/product';
import { Neworder } from '../model/neworder';
import { MyToast } from '../model/Mytoast';
import { ProductTag } from '../model/productTag';
import { Supplier } from '../model/supplier';
import { ProductPurchase } from '../model/productpurchase';

import { BehaviorSubject, Observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Md5 } from 'ts-md5';
import { create } from 'domain';
import { date, string } from 'src/assets/plugins/jszip/jszip';


@Component({
    selector: 'app-purchase-order',
    templateUrl: './purchase-order.component.html',
    styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {

    infoarr: Admin[] = [];
    err: MyToast[] = [];
    allproduct: Product[] = [];
    allProductTag: ProductTag[] = [];
    allProductTagList: ProductTag[] = [];
    allProductList: Product[] = [];
    allSupplier: Supplier[] = [];
    supplierModel;
    listProduct: ProductPurchase[] = [];
    searchTerm;
    sumSubTotal = 0;
    purchaseDiscount = 0;
    purchaseTotal = 0;
    PNAME_ARR: Product[] = []; // arr of product name
    PID_ARR: Product[] = []; // arr of product id
    PSET_ARR: Product[] = []; // arr after unique concat pname pid

    private currentAdminSubject: BehaviorSubject<Admin>;
    public currentAdmin: Observable<Admin>;

    constructor(
        private logoutService: LoginServiceService,
        private getAdminService: AdminService,
        private getUserService: UserService,
        private getProductService: ProductService,
        private getNeworderService: NeworderService,
        private getProductTagService: ProducttagService,
        private getSupplierService: SupplierService,
        private routeLogout: Router,
        private getExcelService: ExcelService,
    ) {
        this.currentAdminSubject = new BehaviorSubject<Admin>(JSON.parse(localStorage.getItem('currentAdmin')));
        this.currentAdmin = this.currentAdminSubject.asObservable();
    }


    ngOnInit(): void {
        this.infoarr.push(JSON.parse(localStorage.getItem('currentAdmin')));
        this.getAllProductTag();
        this.getAllProduct();
        this.getAllSupplier();
    }

    getAllProductTag(): void {
        this.getProductTagService.getProductTag().subscribe((data: any[]) => this.allProductTag = data);
    }
    getAllProduct(): void {
        this.getProductService.getProduct().subscribe((data: any[]) => this.allproduct = data);
    }
    getAllSupplier(): void {
        this.getSupplierService.getSupplier().subscribe((data: any[]) => this.allSupplier = data);
    }
    // async setTagID(): Promise<void> {
    //     this.allProductList = await this.getProductService.getProduct().toPromise();
    //     this.allProductTagList = await this.getProductTagService.getProductTag().toPromise();
    //     for (var i = 0; i < this.allProductList.length; i++) {
    //         for (var j = 0; j < this.allProductList[i].product_tag.length; j++) {
    //             if (this.allProductTagList.filter(a => a.tag_hash_id === this.allProductList[i].product_tag[j].tag_hash_id).length === 1) {

    //                 this.allProductList[i].product_tag[j].tag_id = (this.allProductTagList.filter(a => a.tag_hash_id === this.allProductList[i].product_tag[j].tag_hash_id) as ProductTag[])[0].tag_id;
    //                 this.getProductService.updateProduct(this.allProductList[i]).subscribe();
    //             }
    //         }
    //     }
    // }

    find_product(p: any): void {
        this.searchTerm = '';
        this.PSET_ARR = [];
    }
    input_onblur(): void {
        this.PSET_ARR = [];
    }
    input_close(): void {
        this.searchTerm = '';
        this.input_focus();
    }
    input_focus(): object {
        this.search();
        if (typeof (this.searchTerm) === 'string' && this.searchTerm !== '') {
            return {
                'shadow': true,
            }
        }
    }
    input_blur(): void {
    }
    search(): void {
        if (this.searchTerm !== '') {
            const term = String(this.searchTerm).toLowerCase();
            this.PNAME_ARR = [];
            this.PID_ARR = [];
            // tslint:disable-next-line: only-arrow-functions
            this.PNAME_ARR = this.allproduct.filter(function (s): boolean { return s.product_name.includes(term); });
            // tslint:disable-next-line: only-arrow-functions
            this.PID_ARR = this.allproduct.filter(function (s): boolean { return s.product_id.includes(term); });

            this.PSET_ARR = [];
            const newset = new Set(this.PNAME_ARR.concat(this.PID_ARR));
            const myset = Array.from(newset);
            this.PSET_ARR = myset as Product[];
            this.PSET_ARR.sort();
        }
        else {
            this.PSET_ARR = [];
        }
    }
    selectProduct(product: Product): void {
        if (this.listProduct.filter(a => a.product_object.product_hash_id === product.product_hash_id).length === 0) {
            this.listProduct.push({
                product_object: product,
                product_quantity: 1,
                total_primecost: product.product_prime_cost,
            });
        }
        else {
            (this.listProduct.filter(a => a.product_object.product_hash_id === product.product_hash_id) as ProductPurchase[])[0].product_quantity += 1;
            (this.listProduct.filter(a => a.product_object.product_hash_id === product.product_hash_id) as ProductPurchase[])[0].total_primecost =
                product.product_prime_cost * (this.listProduct.filter(a => a.product_object.product_hash_id === product.product_hash_id) as ProductPurchase[])[0].product_quantity;
        }
        this.calculateTotal();
    }
    removeProduct(pp: ProductPurchase): void {
        this.listProduct.splice(this.listProduct.indexOf(pp), 1);
        this.calculateTotal();
    }
    calculateTotal(): void {
        this.sumSubTotal = this.listProduct.reduce((s, current) => s += current.total_primecost, 0);
        this.purchaseTotal = this.sumSubTotal - this.purchaseDiscount;
    }

    show(i: any): void {
        console.log(i);
    }

    addProduct(pname: string, pprimecost: number, pprice: number, pstock: number, pcategory: string, pweight: number, pbarcode: number, punit: string, pbrand: string, pinfo: string): void {
        if (pname === '') {
            this.make_error('danger', 'Product name is required.');
        }
        else if (String(pprimecost) === '') {
            this.make_error('danger', 'Product prime cost is required.');
        }
        else {
            const id = 'mypid';
            const name = pname;
            const price = pprice;
            const img = '';
            const stock = pstock;
            const bought = 0;
            const created = new Date();
            const updated = new Date();
            const hash: string = (new Md5()).appendStr(name + id + created.toString()).end().toString();
            const primecost = pprimecost;
            const category = pcategory;
            const weight = pweight;
            const description = '';
            const branch = '';
            const tag = [];
            const info = pinfo;
            const barcode = pbarcode;
            const unit = punit;
            const brand = pbrand;

            const uknwProduct = {
                product_id: id,
                product_name: name,
                product_price: price,
                product_img: img,
                product_stock: stock,
                product_bought: bought,
                product_created_at: created,
                product_updated_at: updated,
                product_hash_id: hash,
                product_prime_cost: primecost,
                product_category: category,
                product_weight: weight,
                product_description: description,
                product_branch: branch,
                product_tag: tag,
                additional_info: info,
                product_barcode: barcode,
                product_unit: unit,
                product_brand: brand,
            };
            const newProduct: Product = uknwProduct as Product;
            this.getProductService.addProduct(newProduct).subscribe();
            this.make_error('success', 'New product added successfully.');
            this.listProduct.push({
                product_object: newProduct,
                product_quantity: 1,
                total_primecost: primecost
            });
            this.selectProduct(newProduct);
        }
    }
    addSupplier(
        sname: string, stel: string, semail: string, scompany: string,
        stax: string, saddress: string, sinfo: string): void {
        if (sname === '') {
            this.make_error('danger', ' Supplier name is required.');
        }
        else if (stel === '') {
            this.make_error('danger', ' Supplier telephone number is required.');
        }
        else {
            const created = new Date();
            const updated = new Date();
            const uknwSupplier = {
                supplier_id: 'mysupplierid',
                supplier_hash_id: (new Md5()).appendStr('New supplier' + created.toString()).end().toString(),
                supplier_name: sname,
                supplier_tel: stel,
                supplier_email: semail,
                supplier_company: scompany,
                supplier_tax_number: stax,
                supplier_info: sinfo,
                created_at: created,
                updated_at: updated,
                supplier_address: saddress,
            } as Supplier;
            this.getSupplierService.addSupplier(uknwSupplier).subscribe();
            this.allSupplier.push(uknwSupplier);
            this.supplierModel = uknwSupplier;

            this.make_error('success', 'New supplier added successfully.');
        }
    }
    setPurchase(): void {
        if (this.supplierModel === undefined) {
            this.make_error('danger', 'Please select a supplier.');
        }
        else if (this.listProduct.length === 0) {
            this.make_error('danger', 'There is no product.');
        }
        else {
            const created = new Date();
            const updated = new Date();
            const hash = (new Md5()).appendStr('Nhap hang' + this.infoarr[0].admin_hash_id + created.toString()).end().toString();
            var unkwTag = {
                tag_id: 'mytagid',
                tag_hash_id: hash,
                tag_new_product: this.listProduct,
                tag_name: 'Nhap hang',
                tag_created_at: created,
                tag_updated_at: updated,
                tag_supplier_hid: (this.supplierModel as Supplier).supplier_hash_id,
                tag_emp_created_hid: this.infoarr[0].admin_hash_id,
                tag_emp_updated_hid: this.infoarr[0].admin_hash_id,
                tag_branch_id: 'this branch',
                tag_info: '',
                tag_user_id: '',
                tag_order_id: '',
                tag_discount_amount: this.purchaseDiscount
            };
            this.getProductTagService.addProductTag(unkwTag).subscribe();

            // update quantity to stock and push a tag to the product
            for (var i = 0; i < this.listProduct.length; i++) {
                for (var j = 0; j < this.allproduct.length; j++) {
                    if (this.listProduct[i].product_object.product_hash_id === this.allproduct[j].product_hash_id) {
                        this.allproduct[j].product_stock += this.listProduct[i].product_quantity;
                        this.allproduct[j].product_tag.push(hash);
                        this.getProductService.updateProduct(this.allproduct[j]).subscribe();
                    }
                }
            }

            this.make_error('success', 'Purchase order successfully. Stock updated!');
            this.listProduct = [];
            this.sumSubTotal = 0;
            this.purchaseDiscount = 0;
            this.calculateTotal();
        }
    }
    // updateTag(t: ProductTag, tquantity: number, tbranch: string, tprice: number, tpaid: number): void {
    //     if (String(tquantity) !== '') { t.tag_quantity = tquantity; }
    //     if (tbranch !== '') { t.tag_branch_id = tbranch; }
    //     if (String(tprice) !== '') { t.tag_price = tprice; }
    //     if (String(tpaid) !== '') { t.tag_paid = tpaid; }
    //     t.tag_updated_at = new Date();
    //     this.getProductTagService.updateProductTag(t).subscribe();
    //     this.make_error('success', 'Tag updated successfully.');
    // }
    removeTag(t: ProductTag): void {
        this.getProductTagService.deleteProductTag(t.tag_id).subscribe();
        this.allProductTag.splice(this.allProductTag.indexOf(t), 1);
        this.make_error('info', 'Tag deleted successfully.');
    }


    addOrMinus(i: ProductPurchase, am: string): void {
        if (am === 'add') {
            this.listProduct[this.listProduct.indexOf(i)].product_quantity += 1;
            this.listProduct[this.listProduct.indexOf(i)].total_primecost += this.listProduct[this.listProduct.indexOf(i)].product_object.product_prime_cost;
        }
        else if (am === 'minus') {
            if (this.listProduct[this.listProduct.indexOf(i)].product_quantity === 1) {
                this.removeProduct(i);
            }
            else {
                this.listProduct[this.listProduct.indexOf(i)].product_quantity -= 1;
                this.listProduct[this.listProduct.indexOf(i)].total_primecost -= this.listProduct[this.listProduct.indexOf(i)].product_object.product_prime_cost;
            }
        }
        this.calculateTotal();
    }

    toast_type(t: string): object {
        if (t === 'danger') {
            return {
                'callout': true,
                'callout-danger ': true,
                'color ': 'red',
            };
        }
        else if (t === 'success') {
            return {
                'callout': true,
                'callout-success': true,
                'color': 'green',
            };
        }
        else if (t === 'warning') {
            return {
                'callout': true,
                'callout-warning': true,

            };
        }
        else {
            return {
                'callout': true,
                'callout-info': true,
            };
        }
    }
    toast_color(t: string): object {
        if (t === 'danger') {
            return {
                'color': 'red',
            };
        }
        else if (t === 'success') {
            return {
                'color': 'green',
            };
        }
        else if (t === 'warning') {
            return {
                'color': '#D39E00',
            };
        }
        else {
            return {
                'color': '#0F6E7D',
            };
        }
    }

    make_error(t: string, e: string): void {
        this.err.push({
            type: t,
            message: e
        });
        this.toast_type(t);
        this.toast_color(t);
        setTimeout(() => {
            this.err.splice(this.err.indexOf(this.err[0]), 1);
        }, 5000);
    }

    dismiss_err(e: MyToast): void {
        this.err.splice(this.err.indexOf(e), 1);
    }
}
