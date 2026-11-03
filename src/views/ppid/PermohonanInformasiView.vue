<template>
  <PageDefault
    ref="pageDefault"
    pageStatus="success"
    :isViewerFile="false"
    :isDrawerDefault="false"
    :isModalDefault="false"
    :isModalConfirmation="true"
    :isModalAlert="true"
    @confirmModalConfirmation="onConfirmModalConfirmation"
  >
    <div class="flex flex-col w-full h-full gap-4 xl:gap-6">
      <div class="text-center">
        <div class="text-xl font-bold md:text-2xl lg:text-3xl lg:font-extrabold">
          Permohonan Informasi
        </div>
        <div class="text-xl font-bold md:text-2xl lg:text-3xl lg:font-extrabold">PPID</div>
      </div>
      <div class="flex flex-col w-full gap-6 mb-2 xl:gap-8">
        <div class="grid w-full grid-cols-1 gap-4 xl:gap-6">
          <CardDefault customClass="w-full max-w-screen-lg mx-auto">
            <div class="w-full h-full flex flex-col gap-4 p-0.5 overflow-auto">
              <div class="relative flex flex-col gap-4 p-3 rounded-sm bg-gray-50">
                <FieldInput
                  name="form.nama_pemohon"
                  :label="formData.label.nama_pemohon"
                  :placeholder="`Masukkan ${formData.label.nama_pemohon}`"
                  :disabled="isSubmitting || false"
                  :submitCount="submitCount"
                />
                <FieldInput
                  name="form.nik"
                  :label="formData.label.nik"
                  type="number"
                  :placeholder="`Masukkan ${formData.label.nik}`"
                  :disabled="isSubmitting || false"
                  :submitCount="submitCount"
                />
                <FieldInput
                  name="form.email"
                  :label="formData.label.email"
                  type="email"
                  :placeholder="`Masukkan ${formData.label.email}`"
                  :disabled="isSubmitting || false"
                  :submitCount="submitCount"
                />
                <FieldInput
                  name="form.judul_informasi"
                  :label="formData.label.judul_informasi"
                  :placeholder="`Masukkan ${formData.label.judul_informasi}`"
                  :disabled="isSubmitting || false"
                  :submitCount="submitCount"
                />
                <FieldTextarea
                  name="form.tujuan"
                  :label="formData.label.tujuan"
                  :placeholder="`Masukkan ${formData.label.tujuan}`"
                  :disabled="isSubmitting || false"
                  :submitCount="submitCount"
                />
                <FieldSelect
                  name="form.tipe"
                  :label="formData.label.tipe"
                  :options="tipeOptions"
                  :placeholder="`Pilih ${formData.label.tipe}`"
                  :disabled="isSubmitting || false"
                  :submitCount="submitCount"
                />
                <div class="g-recaptcha" :data-sitekey="sitekey"></div>
              </div>
              <StateResponseError v-if="add.errorMessage" :message="add.errorMessage" />
              <div class="flex justify-end">
                <div>
                  <ButtonDefault
                    @click="onSubmitPressed"
                    type="submit"
                    variant="warning"
                    customClass="flex-1"
                    :disabled="isSubmitting"
                    :loading="isSubmitting"
                  >
                    Kirim
                  </ButtonDefault>
                </div>
              </div>
            </div>
          </CardDefault>
        </div>
      </div>
    </div>
  </PageDefault>
</template>

<script setup lang="ts">
import {
  ButtonDefault,
  CardDefault,
  FieldInput,
  FieldSelect,
  FieldTextarea,
  PageDefault,
  StateResponseError,
  validateInput,
  validateSelect,
  validateTextarea,
  type OptionData,
  type PageDefaultExposed
} from '@bssn/ui-kit-frontend'
import { useForm } from 'vee-validate'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import * as yup from 'yup'

import { usePermohonanInformasiStore } from '@/stores/permohonanInformasiStore'

const pageDefault = ref<PageDefaultExposed | null>(null)

declare const grecaptcha: any

const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? ''

const store = usePermohonanInformasiStore()
const add = computed(() => store.add)

const tipeOptions = ref<OptionData[]>([
  {
    value: 'softcopy',
    label: 'Softcopy'
  },
  {
    value: 'hardcopy',
    label: 'Hardcopy'
  }
])

const schema = yup.object({
  form: yup.object({})
})
const validationSchema = ref(schema)
const formData = {
  label: {
    nama_pemohon: 'Nama',
    nik: 'NIK',
    email: 'Email',
    judul_informasi: 'Judul Informasi',
    tujuan: 'Tujuan Penggunaan Informasi',
    tipe: 'Cara Memperoleh'
  },
  form: {
    nama_pemohon: '',
    nik: '',
    email: '',
    judul_informasi: '',
    tujuan: '',
    tipe: ''
  }
}
const { handleSubmit, isSubmitting, resetForm, submitCount } = useForm({
  validationSchema,
  initialValues: formData
})

// ================================================================================================
// Methods
// ================================================================================================
const onSubmitPressed = () => {
  validationSchema.value = yup.object({
    form: yup.object({
      nama_pemohon: validateInput({
        required: true,
        requiredMessage: `${formData.label.nama_pemohon} harus diisi`
      }),
      nik: validateInput({
        required: true,
        requiredMessage: `${formData.label.nik} harus diisi`
      }),
      email: validateInput({
        required: true,
        requiredMessage: `${formData.label.email} harus diisi`
      }),
      judul_informasi: validateInput({
        required: true,
        requiredMessage: `${formData.label.judul_informasi} harus diisi`
      }),
      tujuan: validateTextarea({
        required: true,
        requiredMessage: `${formData.label.tujuan} harus diisi`
      }),
      tipe: validateSelect({
        required: true,
        requiredMessage: `${formData.label.tipe} harus diisi`
      })
    })
  })

  onSubmit()
}
const onSubmit = handleSubmit(async (values) => {
  openModalConfirmation(values.form)
})
const openModalConfirmation = (valuesForm: Record<string, any>) => {
  pageDefault.value?.openModalConfirmation(
    'danger',
    'Ya, Saya yakin',
    'Tidak, Batalkan',
    '0',
    '',
    'Apakah Anda yakin ingin mengirim permohonan informasi ini?',
    {
      data: valuesForm
    },
    'center',
    'max-w-xl'
  )
}
const onConfirmModalConfirmation = async (id: string, valuesForm: Record<string, any>) => {
  const token = grecaptcha.getResponse()
  if (!token) {
    pageDefault.value?.openModalAlert(
      'warning',
      '',
      'Validasi reCAPTCHA Gagal. Harap centang reCAPTCHA terlebih dahulu.',
      0,
      'center',
      'max-w-xl'
    )
  } else {
    const formValues = valuesForm.data ?? valuesForm
    const payload = {
      ...formValues,
      nik: formValues.nik != null ? String(formValues.nik) : '',
      recaptcha_token: token
    }
    await store.callAdd(payload)
    if (add.value.status === 'success') {
      grecaptcha.reset()
      store.clearAdd()
      resetForm()
      pageDefault.value?.openModalAlert(
        'success',
        '',
        'Permohonan Informasi Anda telah dicatat. Terima kasih telah menggunakan layanan PPID BSSN.',
        0,
        'center',
        'max-w-xl'
      )
    } else {
      pageDefault.value?.openModalAlert(
        'danger',
        '',
        'Gagal kirim Permohonan Informasi. Silahkan periksa kembali data yang Anda masukkan.',
        0,
        'center',
        'max-w-xl'
      )
    }
  }
  pageDefault.value?.closeModalConfirmation()
}

// ================================================================================================
// Lifecycle
// ================================================================================================
onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://www.google.com/recaptcha/api.js'
  script.async = true
  script.defer = true
  document.body.appendChild(script)
})
onUnmounted(() => {
  store.clearAdd()
  resetForm()
})
</script>
