<?php

namespace App\Http\Controllers;

use App\Models\Part;
use App\Models\ProductModel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminController extends Controller
{
    // ==========================================
    // USER MANAGEMENT
    // ==========================================

    /**
     * Halaman daftar user.
     */
    public function users()
    {
        return Inertia::render('Admin/Users', [
            'users' => User::orderBy('name')->get(),
        ]);
    }

    /**
     * Simpan user baru.
     */
    public function storeUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,supervisor,operator',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return redirect()->back()->with('success', 'User berhasil ditambahkan.');
    }

    /**
     * Update user.
     */
    public function updateUser(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,supervisor,operator',
        ]);

        $data = $request->only('name', 'email', 'role');

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return redirect()->back()->with('success', 'User berhasil diperbarui.');
    }

    /**
     * Hapus user.
     */
    public function deleteUser(User $user)
    {
        $user->delete();
        return redirect()->back()->with('success', 'User berhasil dihapus.');
    }

    // ==========================================
    // PRODUCT MODEL MANAGEMENT
    // ==========================================

    /**
     * Halaman daftar produk & part.
     */
    public function products()
    {
        return Inertia::render('Admin/Products', [
            'productModels' => ProductModel::with('parts')->orderBy('name')->get(),
        ]);
    }

    /**
     * Simpan product model baru.
     */
    public function storeModel(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:product_models,name',
        ]);

        ProductModel::create(['name' => $request->name]);

        return redirect()->back()->with('success', 'Model produk berhasil ditambahkan.');
    }

    /**
     * Hapus product model beserta semua part-nya.
     */
    public function deleteModel(ProductModel $productModel)
    {
        $productModel->delete();
        return redirect()->back()->with('success', 'Model produk berhasil dihapus.');
    }

    // ==========================================
    // PART MANAGEMENT
    // ==========================================

    /**
     * Simpan part baru.
     */
    public function storePart(Request $request)
    {
        $request->validate([
            'product_model_id' => 'required|exists:product_models,id',
            'part_no' => 'required|string|max:255',
            'part_name' => 'required|string|max:255',
            'ai_model_file' => 'nullable|string|max:255',
        ]);

        Part::create($request->only('product_model_id', 'part_no', 'part_name', 'ai_model_file'));

        return redirect()->back()->with('success', 'Part berhasil ditambahkan.');
    }

    /**
     * Update part.
     */
    public function updatePart(Request $request, Part $part)
    {
        $request->validate([
            'part_no' => 'required|string|max:255',
            'part_name' => 'required|string|max:255',
            'ai_model_file' => 'nullable|string|max:255',
        ]);

        $part->update($request->only('part_no', 'part_name', 'ai_model_file'));

        return redirect()->back()->with('success', 'Part berhasil diperbarui.');
    }

    /**
     * Hapus part.
     */
    public function deletePart(Part $part)
    {
        $part->delete();
        return redirect()->back()->with('success', 'Part berhasil dihapus.');
    }
}
