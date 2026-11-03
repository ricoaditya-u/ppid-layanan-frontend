<template>
  <CardDefault backgroundClass="bg-primary-500">
    <div class="flex flex-col w-full gap-4">
      <div class="text-lg font-medium text-center text-white">
        Informasi Apa Yang Ingin Anda Cari?
      </div>
      <CardDefault
        backgroundClass="bg-white"
        paddingClass="p-2 xl:p-4"
        customClass="w-full max-w-screen-lg mx-auto"
      >
        <div class="flex flex-col items-center gap-2 lg:flex-row">
          <div class="flex flex-col w-full gap-2 md:flex-row">
            <div class="flex items-center w-full lg:flex-1">
              <font-awesome-icon
                :icon="['fad', 'file-magnifying-glass']"
                class="w-5 h-5 text-primary-500"
              />
              <FieldInput
                name="form.keyword"
                :required="false"
                :placeholder="`${formData.label.keyword}`"
                :disabled="isSubmitting || false"
                :submitCount="submitCount"
                class="flex-1"
                customClass="border-0 focus:ring-0"
              />
            </div>
            <div class="w-full lg:w-40">
              <FieldSelect
                name="form.kategoriId"
                :required="false"
                :options="kategoriOptions"
                :placeholder="`Semua ${formData.label.kategoriId}`"
                :disabled="isSubmitting || false"
                :submitCount="submitCount"
                @update:value="onFieldTipeUpdated"
              />
            </div>
          </div>
          <div class="flex flex-col w-full gap-2 lg:w-min md:flex-row">
            <div class="w-full lg:w-40">
              <FieldSelect
                name="form.jenisId"
                :required="false"
                :options="jenisIdOptions"
                :placeholder="`Semua ${formData.label.jenisId}`"
                :disabled="isSubmitting || false || jenisIdOptions.length === 0"
                :submitCount="submitCount"
              />
            </div>
          </div>
          <ButtonDefault
            @click="onSubmitPressed"
            type="submit"
            variant="warning"
            customClass="px-16 py-2"
            :disabled="isSubmitting"
            :loading="isSubmitting"
          >
            Cari
          </ButtonDefault>
        </div>
      </CardDefault>
    </div>
  </CardDefault>
</template>

<script setup lang="ts">
import {
  ButtonDefault,
  CardDefault,
  FieldInput,
  FieldSelect,
  validateInput,
  validateSelect,
  type OptionData
} from '@bssn/ui-kit-frontend'
import { useForm } from 'vee-validate'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as yup from 'yup'

import { kategoriOptions } from '@/const'
import { useInformasiStore } from '@/stores/informasiStore'

const route = useRoute()
const router = useRouter()

const jenisIdOptions = ref<OptionData[]>([])

const schema = yup.object({
  form: yup.object({})
})
const validationSchema = ref(schema)
const formData = {
  label: {
    keyword: 'Ketik Judul Informasi',
    kategoriId: 'Kategori',
    jenisId: 'Jenis'
  },
  form: {
    keyword: '',
    kategoriId: '',
    jenisId: ''
  }
}
const { handleSubmit, isSubmitting, resetForm, resetField, setValues, submitCount } = useForm({
  validationSchema,
  initialValues: formData
})

const store = useInformasiStore()

const loadJenisOptions = async (kategoriId: string) => {
  if (!kategoriId) {
    jenisIdOptions.value = []
    return
  }
  await store.callJenisOptions(kategoriId)
  jenisIdOptions.value = [...store.jenisOptions]
}

const onSubmitPressed = () => {
  validationSchema.value = yup.object({
    form: yup.object({
      keyword: validateInput({ required: false }),
      kategoriId: validateSelect({ required: false }),
      jenisId: validateSelect({ required: false })
    })
  })

  onSubmit()
}
const onSubmit = handleSubmit((values) => {
  if (route.name === 'ppid.beranda.index') {
    store.keyword = values.form.keyword
    store.kategoriId = values.form.kategoriId
    store.jenisId = values.form.jenisId
    router.push({ name: 'ppid.cari.index' })
  } else {
    store.callRecords(
      'general',
      values.form.keyword,
      values.form.kategoriId,
      values.form.jenisId,
      1
    )
  }
})

const onFieldTipeUpdated = async (value: string) => {
  resetField('form.jenisId')
  await loadJenisOptions(value)
}

onMounted(async () => {
  formData.form.keyword = store.keyword
  formData.form.kategoriId = store.kategoriId
  formData.form.jenisId = store.jenisId

  await loadJenisOptions(formData.form.kategoriId)
  setValues(formData, false)
})
onUnmounted(() => {
  if (route.name !== 'ppid.cari.index') {
    store.keyword = ''
    store.kategoriId = ''
    store.jenisId = ''
    store.clearJenisOptions()
    resetForm()
  }
})
</script>
