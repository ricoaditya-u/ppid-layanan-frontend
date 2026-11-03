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
          Permohonan Keberatan
        </div>
        <div class="text-xl font-bold md:text-2xl lg:text-3xl lg:font-extrabold">PPID</div>
      </div>
      <div class="flex flex-col w-full gap-6 mb-2 xl:gap-8">
        <div class="grid w-full grid-cols-1 gap-4 xl:gap-6">
          <CardDefault customClass="w-full max-w-screen-lg mx-auto">
            <div class="w-full h-full flex flex-col gap-4 p-0.5 overflow-auto">
              <div class="relative flex flex-col gap-4 p-3 rounded-sm bg-gray-50">
                <FieldInput
                  name="form.nama"
                  :label="formData.label.nama"
                  :placeholder="`Masukkan ${formData.label.nama}`"
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
                <FieldSelect
                  name="form.alasan_keberatan"
                  :label="formData.label.alasan_keberatan"
                  :options="alasanKeberatanOptions"
                  :placeholder="`Pilih ${formData.label.alasan_keberatan}`"
                  :disabled="isSubmitting || false"
                  :submitCount="submitCount"
                />
                <FieldTextarea
                  name="form.alasan_detail"
                  :label="formData.label.alasan_detail"
                  :placeholder="`Masukkan ${formData.label.alasan_detail}`"
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
  mapPrimitiveToOptionData,
  PageDefault,
  StateResponseError,
  validateInput,
  validateSelect,
  validateTextarea,
  type PageDefaultExposed
} from '@bssn/ui-kit-frontend'
import { useForm } from 'vee-validate'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import * as yup from 'yup'

import { usePermohonanKeberatanStore } from '@/stores/permohonanKeberatanStore'

const pageDefault = ref<PageDefaultExposed | null>(null)

declare const grecaptcha: any

const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? ''

const store = usePermohonanKeberatanStore()
const add = computed(() => store.add)

const alasanKeberatanOptions = mapPrimitiveToOptionData([
  'Penolakan atas permintaan informasi',
  'Tidak ditanggapinya permintaan informasi',
  'Tidak dipenuhinya permintaan informasi',
  'Pengenaan biaya yang tidak wajar',
  'Alasan lainnya'
])

const schema = yup.object({
  form: yup.object({})
})
const validationSchema = ref(schema)
const formData = {
  label: {
    nama: 'Nama',
    nik: 'NIK',
    email: 'Email',
    alasan_keberatan: 'Alasan Keberatan',
    alasan_detail: 'Alasan Detail'
  },
  form: {
    nama: '',
    nik: '',
    email: '',
    alasan_detail: '',
    alasan_keberatan: ''
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
      nama: validateInput({
        required: true,
        requiredMessage: `${formData.label.nama} harus diisi`
      }),
      nik: validateInput({
        required: true,
        requiredMessage: `${formData.label.nik} harus diisi`
      }),
      email: validateInput({
        required: true,
        requiredMessage: `${formData.label.email} harus diisi`
      }),
      alasan_detail: validateTextarea({
        required: true,
        requiredMessage: `${formData.label.alasan_detail} harus diisi`
      }),
      alasan_keberatan: validateSelect({
        required: true,
        requiredMessage: `${formData.label.alasan_keberatan} harus diisi`
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
    'Apakah Anda yakin ingin mengirim permohonan keberatan ini?',
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
        'Permohonan Keberatan Anda telah dicatat. Terima kasih telah menggunakan layanan PPID BSSN.',
        0,
        'center',
        'max-w-xl'
      )
    } else {
      pageDefault.value?.openModalAlert(
        'danger',
        '',
        'Gagal kirim Permohonan Keberatan. Silahkan periksa kembali data yang Anda masukkan.',
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
